const { Op, DataTypes } = require("sequelize");

const COMPARISON_OPS = { gt: Op.gt, gte: Op.gte, lt: Op.lt, lte: Op.lte };

// Escape LIKE wildcards so the keyword is matched literally
const escapeLike = (str) => str.replace(/[\\%_]/g, (c) => `\\${c}`);

// Builds Sequelize `where` / `limit` / `offset` options from the query string
class ApiFeatures {
  constructor(model, queryStr) {
    this.model = model;
    this.queryStr = queryStr;
    this.where = {};
    this.limit = undefined;
    this.offset = undefined;
  }

  search() {
    const { keyword } = this.queryStr;

    if (typeof keyword === "string" && keyword.trim() !== "") {
      this.where.name = { [Op.iLike]: `%${escapeLike(keyword.trim())}%` };
    }

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating, e.g. price[gte]=0&price[lte]=25000
    const attributes = this.model.rawAttributes;

    Object.entries(queryCopy).forEach(([key, value]) => {
      const attribute = attributes[key];

      // Only allow filtering on real columns
      if (!attribute || attribute.type instanceof DataTypes.VIRTUAL) return;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        const conditions = {};

        Object.entries(value).forEach(([op, val]) => {
          if (COMPARISON_OPS[op] && typeof val === "string" && val !== "") {
            conditions[COMPARISON_OPS[op]] = val;
          }
        });

        if (Object.getOwnPropertySymbols(conditions).length) {
          this.where[key] = { ...(this.where[key] || {}), ...conditions };
        }
      } else if (typeof value === "string" && value !== "") {
        this.where[key] = value;
      }
    });

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.limit = resultPerPage;
    this.offset = skip;

    return this;
  }

  // Options ready to pass to Model.findAll / findAndCountAll
  toFindOptions() {
    return { where: this.where, limit: this.limit, offset: this.offset };
  }
}

module.exports = ApiFeatures;
