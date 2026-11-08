const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns } = require("./helpers");

// Product reviews (previously embedded in the product document)
class Review extends Model {}

Review.init(
  {
    ...idColumns(),
    user: {
      type: DataTypes.UUID,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    indexes: [{ unique: true, fields: ["product_id", "user_id"] }],
  }
);

module.exports = Review;
