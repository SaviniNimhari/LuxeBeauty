const { DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sequelize } = require("../config/database");
const { idColumns } = require("./helpers");

class User extends Model {
  // JWT TOKEN
  getJWTToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // Compare Password
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Generating Password Reset Token
  getResetPasswordToken() {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to user
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    return resetToken;
  }

  // Never send the password hash or reset token to the client
  toJSON() {
    const values = this.get({ plain: true });
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpire;
    return values;
  }
}

User.init(
  {
    ...idColumns(),
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notNull: { msg: "Please Enter Your Name" },
        len: {
          args: [4, 30],
          msg: "Name should be between 4 and 30 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: "Please Enter Your Email" },
        isEmail: { msg: "Please Enter a valid Email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Please Enter Your Password" },
        len: {
          args: [8, 128],
          msg: "Password should be greater than 8 characters",
        },
      },
    },
    avatar: {
      // { public_id, url }
      type: DataTypes.JSONB,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      // Validation runs before this hook, so length checks apply to the
      // plain-text password and only the hash is stored.
      beforeSave: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

module.exports = User;
