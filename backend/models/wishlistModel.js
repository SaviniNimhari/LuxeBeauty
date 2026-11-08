const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns } = require("./helpers");

class Wishlist extends Model {}

Wishlist.init(
  {
    ...idColumns(),
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlists",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "product_id"],
      },
    ],
  }
);

module.exports = Wishlist;
