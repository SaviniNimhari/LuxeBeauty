const { DataTypes } = require("sequelize");

// UUID primary key + a virtual `_id` alias so API responses keep the same
// shape the frontend expects from the old MongoDB documents.
exports.idColumns = () => ({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  _id: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue("id");
    },
  },
});

// Postgres returns DECIMAL values as strings; convert them back to numbers.
exports.decimal = (field, options = {}) => ({
  type: DataTypes.DECIMAL(12, 2),
  ...options,
  get() {
    const value = this.getDataValue(field);
    return value === null || value === undefined ? value : parseFloat(value);
  },
});
