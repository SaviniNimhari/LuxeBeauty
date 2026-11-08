const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns, decimal } = require("./helpers");

class Product extends Model {}

Product.init(
  {
    ...idColumns(),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("name", typeof value === "string" ? value.trim() : value);
      },
      validate: { notNull: { msg: "Please Enter product Name" } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notNull: { msg: "Please Enter product Description" } },
    },
    price: decimal("price", {
      allowNull: false,
      validate: {
        notNull: { msg: "Please Enter product Price" },
        max: { args: [99999999], msg: "Price cannot exceed 8 characters" },
      },
    }),
    ratings: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    images: {
      // [{ public_id, url }]
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: "Please Enter Product Category" } },
    },
    Stock: {
      type: DataTypes.INTEGER,
      field: "stock",
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: { msg: "Please Enter product Stock" },
        max: { args: [9999], msg: "Stock cannot exceed 4 characters" },
      },
    },
    numOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Admin who created the product
    user: {
      type: DataTypes.UUID,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    indexes: [{ fields: ["category"] }, { fields: ["price"] }],
  }
);

module.exports = Product;
