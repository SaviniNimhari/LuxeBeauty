// Registers all models and their associations
const User = require("./userModel");
const Product = require("./productModel");
const Review = require("./reviewModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");
const Coupon = require("./couponModel");
const Wishlist = require("./wishlistModel");

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

// User 1 --- * Order
User.hasMany(Order, {
  foreignKey: { name: "userId", field: "user_id" },
  onDelete: "SET NULL",
});
Order.belongsTo(User, {
  as: "user",
  foreignKey: { name: "userId", field: "user_id" },
});

// User (Seller/Admin creator) 1 --- * Product
User.hasMany(Product, {
  foreignKey: { name: "user", field: "user_id" },
  onDelete: "SET NULL",
});
Product.belongsTo(User, {
  as: "creator",
  foreignKey: { name: "user", field: "user_id" },
});

// User 1 --- * Wishlist
User.hasMany(Wishlist, {
  as: "wishlistItems",
  foreignKey: { name: "userId", field: "user_id", allowNull: false },
  onDelete: "CASCADE",
});
Wishlist.belongsTo(User, {
  foreignKey: { name: "userId", field: "user_id", allowNull: false },
});

// Product 1 --- * Wishlist
Product.hasMany(Wishlist, {
  foreignKey: { name: "productId", field: "product_id", allowNull: false },
  onDelete: "CASCADE",
});
Wishlist.belongsTo(Product, {
  as: "product",
  foreignKey: { name: "productId", field: "product_id", allowNull: false },
});

module.exports = { User, Product, Review, Order, OrderItem, Coupon, Wishlist };
