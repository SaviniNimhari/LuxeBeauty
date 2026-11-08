const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns, decimal } = require("./helpers");

// Line items of an order (previously embedded in the order document)
class OrderItem extends Model {}

OrderItem.init(
  {
    ...idColumns(),
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: decimal("price", { allowNull: false }),
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Kept as a snapshot even if the product is later deleted
    product: {
      type: DataTypes.UUID,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
  }
);

module.exports = OrderItem;
