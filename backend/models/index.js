// Registers all models and their associations
const User = require("./userModel");
const Product = require("./productModel");
const Review = require("./reviewModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");

// Product 1 --- * Review
Product.hasMany(Review, {
  as: "reviews",
  foreignKey: { name: "productId", field: "product_id", allowNull: false },
  onDelete: "CASCADE",
});
Review.belongsTo(Product, {
  foreignKey: { name: "productId", field: "product_id", allowNull: false },
});

// Order 1 --- * OrderItem
Order.hasMany(OrderItem, {
  as: "orderItems",
  foreignKey: { name: "orderId", field: "order_id", allowNull: false },
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: { name: "orderId", field: "order_id", allowNull: false },
});

// User 1 --- * Order (orders are kept if the user is deleted)
User.hasMany(Order, {
  foreignKey: { name: "userId", field: "user_id" },
  onDelete: "SET NULL",
});
Order.belongsTo(User, {
  as: "user",
  foreignKey: { name: "userId", field: "user_id" },
});

module.exports = { User, Product, Review, Order, OrderItem };
