const { Order, OrderItem, Product, User } = require("../models");
const { sequelize } = require("../config/database");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const orderItemsInclude = {
  model: OrderItem,
  as: "orderItems",
  attributes: { exclude: ["orderId"] },
};

// Create new Order
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

  const order = await sequelize.transaction((transaction) =>
    Order.create(
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
    )
  );

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

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [orderItemsInclude],
    order: [["createdAt", "ASC"]],
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    include: [orderItemsInclude],
    order: [["createdAt", "ASC"]],
  });

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
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
    if (req.body.status === "Shipped") {
      for (const o of order.orderItems) {
        await updateStock(o.product, o.quantity, transaction);
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

async function updateStock(id, quantity, transaction) {
  // Product may have been deleted since the order was placed
  if (!id) return;

  await Product.decrement("Stock", {
    by: quantity,
    where: { id },
    transaction,
  });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // Order items are removed by ON DELETE CASCADE
  await order.destroy();

  res.status(200).json({
    success: true,
  });
});
