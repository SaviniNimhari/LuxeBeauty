const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/database");
const { idColumns, decimal } = require("./helpers");

class Coupon extends Model {
  // Validate whether coupon is eligible for a specific order amount
  isValid(orderAmount = 0) {
    if (!this.isActive) {
      return { valid: false, message: "This coupon is no longer active." };
    }

    if (this.expiryDate && new Date(this.expiryDate) < new Date()) {
      return { valid: false, message: "This coupon has expired." };
    }

    if (this.usageLimit && this.usedCount >= this.usageLimit) {
      return { valid: false, message: "Coupon usage limit has been reached." };
    }

    if (this.minOrderAmount && orderAmount < this.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of Rs. ${this.minOrderAmount} required for this coupon.`,
      };
    }

    return { valid: true };
  }

  // Calculate discount amount for an order
  calculateDiscount(orderAmount = 0) {
    const check = this.isValid(orderAmount);
    if (!check.valid) return { discount: 0, error: check.message };

    let discount = 0;
    if (this.discountType === "percentage") {
      discount = (orderAmount * this.discountValue) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
    } else {
      discount = this.discountValue;
    }

    // Discount cannot exceed order total
    discount = Math.min(discount, orderAmount);

    return {
      discount: Math.round(discount * 100) / 100,
      finalAmount: Math.round((orderAmount - discount) * 100) / 100,
    };
  }
}

Coupon.init(
  {
    ...idColumns(),
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Coupon code is required" },
        len: { args: [3, 50], msg: "Code must be between 3 and 50 characters" },
      },
      set(val) {
        this.setDataValue("code", val ? val.trim().toUpperCase() : "");
      },
    },
    discountType: {
      type: DataTypes.ENUM("percentage", "fixed"),
      allowNull: false,
      defaultValue: "percentage",
    },
    discountValue: decimal("discountValue", {
      allowNull: false,
      validate: {
        notNull: { msg: "Discount value is required" },
        min: { args: [1], msg: "Discount must be greater than 0" },
      },
    }),
    minOrderAmount: decimal("minOrderAmount", {
      defaultValue: 0,
    }),
    maxDiscount: decimal("maxDiscount", {
      allowNull: true,
    }),
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Coupon",
    tableName: "coupons",
  }
);

module.exports = Coupon;
