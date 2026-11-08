const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Invalid id / value format (e.g. malformed UUID) -- Postgres code 22P02
  if (
    err.name === "SequelizeDatabaseError" &&
    err.parent &&
    err.parent.code === "22P02"
  ) {
    const message = `Resource not found. Invalid: ${err.parent.message}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error (unique constraint)
  if (err.name === "SequelizeUniqueConstraintError") {
    const fields = err.fields ? Object.keys(err.fields) : [];
    const message = `Duplicate ${fields.join(", ")} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Model validation error
  if (err.name === "SequelizeValidationError") {
    const message = err.errors.map((e) => e.message).join(", ");
    err = new ErrorHandler(message, 400);
  }

  // Referenced row does not exist (e.g. unknown product id)
  if (err.name === "SequelizeForeignKeyConstraintError") {
    const message = `Resource not found. Invalid reference: ${err.index || err.fields}`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
