const { Coupon } = require("../models");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Validate coupon code for checkout
exports.validateCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code, orderAmount = 0 } = req.body;

  if (!code) {
    return next(new ErrorHander("Please enter a coupon code", 400));
  }

  const coupon = await Coupon.findOne({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) {
    return next(new ErrorHander("Invalid coupon code", 404));
  }

  const check = coupon.isValid(Number(orderAmount));
  if (!check.valid) {
    return next(new ErrorHander(check.message, 400));
  }

  const calculation = coupon.calculateDiscount(Number(orderAmount));

  res.status(200).json({
    success: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: calculation.discount,
      finalAmount: calculation.finalAmount,
    },
  });
});

// Create new Coupon -- Admin
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
  } = req.body;

  const existing = await Coupon.findOne({
    where: { code: String(code).trim().toUpperCase() },
  });

  if (existing) {
    return next(new ErrorHander("Coupon code already exists", 400));
  }

  const coupon = await Coupon.create({
    code,
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscount: maxDiscount || null,
    expiryDate: expiryDate || null,
    usageLimit: usageLimit || null,
  });

  res.status(201).json({
    success: true,
    coupon,
  });
});

// Get all coupons -- Admin
exports.getAllCoupons = catchAsyncErrors(async (req, res, next) => {
  const coupons = await Coupon.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    success: true,
    coupons,
  });
});

// Delete coupon -- Admin
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findByPk(req.params.id);

  if (!coupon) {
    return next(new ErrorHander("Coupon not found", 404));
  }

  await coupon.destroy();

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
  });
});
