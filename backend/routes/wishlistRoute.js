const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
} = require("../controllers/wishlistController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/wishlist/add").post(isAuthenticatedUser, addToWishlist);
router.route("/wishlist/me").get(isAuthenticatedUser, getMyWishlist);
router
  .route("/wishlist/remove/:productId")
  .delete(isAuthenticatedUser, removeFromWishlist);

module.exports = router;
