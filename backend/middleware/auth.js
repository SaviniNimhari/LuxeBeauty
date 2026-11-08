const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { User } = require("../models");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Tokens issued before the PostgreSQL migration contain Mongo ObjectIds
  const user =
    decodedData.id && validator.isUUID(String(decodedData.id))
      ? await User.findByPk(decodedData.id)
      : null;

  if (!user) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  req.user = user;

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
