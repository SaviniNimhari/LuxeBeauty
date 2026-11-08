const { Order, OrderItem, Product, User } = require("../models");
const { sequelize } = require("../config/database");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const orderItemsInclude = {
  model: OrderItem,
  as: "orderItems",
  attributes: { exclude: ["orderId"] },
};

// Create new Order with Atomic Stock Verification & Deduction Transaction
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems = [],
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHander("No order items provided", 400));
  }

  // Execute order creation and stock updates within an ACID transaction
  const order = await sequelize.transaction(async (transaction) => {
    // 1. Verify stock availability for all items before decrementing
    for (const item of orderItems) {
      if (!item.product) continue;

      const product = await Product.findByPk(item.product, { transaction });
      if (!product) {
        throw new ErrorHander(
          `Product "${item.name}" is no longer available in the catalog.`,
          404
        );
      }

      if (product.Stock < item.quantity) {
        throw new ErrorHander(
          `Insufficient stock for "${product.name}". Only ${product.Stock} remaining in inventory.`,
          400
        );
      }

      // 2. Decrement stock atomically
      await Product.decrement("Stock", {
        by: item.quantity,
        where: { id: item.product },
        transaction,
      });
    }

    // 3. Create Order and associated OrderItems
    return await Order.create(
      {
        shippingInfo,
        orderItems: orderItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product: item.product,
        })),
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: new Date(),
        userId: req.user.id,
      },
      { include: [orderItemsInclude], transaction }
    );
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      orderItemsInclude,
      { model: User, as: "user", attributes: ["id", "name", "email"] },
    ],
  });

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // Non-admin / non-seller can only view their own order
  if (
    req.user.role !== "admin" &&
    req.user.role !== "seller" &&
    order.userId !== req.user.id
  ) {
    return next(
      new ErrorHander("Access denied. You can only view your own orders.", 403)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [orderItemsInclude],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin / Seller (scoped)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  let orders = await Order.findAll({
    include: [
      orderItemsInclude,
      { model: User, as: "user", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  // If user is a seller, filter to orders containing products owned by the seller
  if (req.user.role === "seller") {
    const sellerProducts = await Product.findAll({
      where: { user: req.user.id },
      attributes: ["id"],
    });
    const sellerProductIds = new Set(sellerProducts.map((p) => String(p.id)));

    // If seller has products, filter orders containing at least one seller item
    if (sellerProductIds.size > 0) {
      orders = orders.filter((order) =>
        order.orderItems.some((item) => sellerProductIds.has(String(item.product)))
      );
    }
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice || 0;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin / Seller
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, {
    include: [orderItemsInclude],
  });

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  await sequelize.transaction(async (transaction) => {
    // If order is cancelled, restore reserved inventory
    if (req.body.status === "Cancelled" && order.orderStatus !== "Cancelled") {
      for (const item of order.orderItems) {
        if (item.product) {
          await Product.increment("Stock", {
            by: item.quantity,
            where: { id: item.product },
            transaction,
          });
        }
      }
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = new Date();
    }

    await order.save({ transaction, validate: false });
  });

  res.status(200).json({
    success: true,
  });
});

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id, {
    include: [orderItemsInclude],
  });

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await sequelize.transaction(async (transaction) => {
    // Restore inventory if the deleted order was still active
    if (order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered") {
      for (const item of order.orderItems) {
        if (item.product) {
          await Product.increment("Stock", {
            by: item.quantity,
            where: { id: item.product },
            transaction,
          });
        }
      }
    }

    await order.destroy({ transaction });
  });

  res.status(200).json({
    success: true,
  });
});
