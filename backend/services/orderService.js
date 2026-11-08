const { Order, Product, sequelize } = require("../models");
const productService = require("./productService");

class OrderService {
  /**
   * Create order in an atomic database transaction
   */
  async createOrderWithTransaction(orderData, userId) {
    const t = await sequelize.transaction();

    try {
      const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = orderData;

      // 1. Pre-validate stock for every item
      for (const item of orderItems) {
        const product = await Product.findByPk(item.product, { transaction: t });

        if (!product) {
          throw new Error(`Product "${item.name}" not found`);
        }

        if (!productService.isStockAvailable(product, item.quantity, item.sku)) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.Stock}, Requested: ${item.quantity}`
          );
        }

        // Decrement product stock atomically
        product.Stock -= item.quantity;
        if (item.sku && product.variants && product.variants.length > 0) {
          product.variants = product.variants.map((v) => {
            if (v.sku === item.sku) {
              return { ...v, stock: Math.max(0, v.stock - item.quantity) };
            }
            return v;
          });
        }
        await product.save({ transaction: t });
        await productService.invalidateProductCache(product.id);
      }

      // 2. Create the order
      const order = await Order.create(
        {
          shippingInfo,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          paidAt: Date.now(),
          user: userId,
        },
        { transaction: t }
      );

      await t.commit();
      return order;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Restore stock on order cancellation
   */
  async restoreOrderStock(order) {
    const t = await sequelize.transaction();
    try {
      for (const item of order.orderItems) {
        const product = await Product.findByPk(item.product, { transaction: t });
        if (product) {
          product.Stock += item.quantity;
          if (item.sku && product.variants && product.variants.length > 0) {
            product.variants = product.variants.map((v) => {
              if (v.sku === item.sku) {
                return { ...v, stock: v.stock + item.quantity };
              }
              return v;
            });
          }
          await product.save({ transaction: t });
          await productService.invalidateProductCache(product.id);
        }
      }
      order.orderStatus = "Cancelled";
      await order.save({ transaction: t });
      await t.commit();
      return order;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}

module.exports = new OrderService();
