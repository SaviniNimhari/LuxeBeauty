const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns, decimal } = require("./helpers");

const requireKeys = (keys) => (value) => {
  for (const key of keys) {
    if (!value || value[key] === undefined || value[key] === null || value[key] === "") {
      throw new Error(`${key} is required`);
    }
  }
};

class Order extends Model {
  toJSON() {
    const values = this.get({ plain: true });

    // Populated user -> { _id, name, email }; otherwise just the user id
    if (values.user) {
      values.user = { _id: values.user.id, ...values.user };
    } else {
      values.user = values.userId;
    }
    delete values.userId;

    return values;
  }
}

Order.init(
  {
    ...idColumns(),
    shippingInfo: {
      // { address, city, state, country, pinCode, phoneNo }
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        hasRequiredFields: requireKeys([
          "address",
          "city",
          "state",
          "country",
          "pinCode",
          "phoneNo",
        ]),
      },
    },
    paymentInfo: {
      // { id, status }
      type: DataTypes.JSONB,
      allowNull: false,
      validate: { hasRequiredFields: requireKeys(["id", "status"]) },
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    itemsPrice: decimal("itemsPrice", { allowNull: false, defaultValue: 0 }),
    taxPrice: decimal("taxPrice", { allowNull: false, defaultValue: 0 }),
    shippingPrice: decimal("shippingPrice", { allowNull: false, defaultValue: 0 }),
    totalPrice: decimal("totalPrice", { allowNull: false, defaultValue: 0 }),
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Processing",
    },
    deliveredAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
  }
);

module.exports = Order;
