const { Wishlist, Product } = require("../models");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Add product to user wishlist
exports.addToWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new ErrorHander("Please provide a valid Product ID", 400));
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const [item, created] = await Wishlist.findOrCreate({
    where: {
      userId: req.user.id,
      productId,
    },
  });

  res.status(200).json({
    success: true,
    message: created
      ? "Product added to your wishlist"
      : "Product is already in your wishlist",
    item,
  });
});

// Remove product from wishlist
exports.removeFromWishlist = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const item = await Wishlist.findOne({
    where: {
      userId: req.user.id,
      productId,
    },
  });

  if (!item) {
    return next(new ErrorHander("Product not found in your wishlist", 404));
  }

  await item.destroy();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
  });
});

// Get logged in user's wishlist
exports.getMyWishlist = catchAsyncErrors(async (req, res, next) => {
  const items = await Wishlist.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Filter out any orphaned wishlist entries where product might have been removed
  const wishlist = items
    .filter((entry) => Boolean(entry.product))
    .map((entry) => entry.product);

  res.status(200).json({
    success: true,
    count: wishlist.length,
    wishlist,
  });
});
