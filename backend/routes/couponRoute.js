const express = require("express");
const {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../controllers/couponController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/coupon/validate").post(validateCoupon);

router
  .route("/admin/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCoupon);

router
  .route("/admin/coupons")
  .get(isAuthenticatedUser, authorizeRoles("admin", "seller"), getAllCoupons);

router
  .route("/admin/coupon/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

module.exports = router;
