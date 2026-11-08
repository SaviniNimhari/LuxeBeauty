const { Product, Review } = require("../models");
const { sequelize } = require("../config/database");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

const PRODUCT_FIELDS = ["name", "description", "price", "category", "Stock"];

// Pick allowed, defined fields from the request body
const pickFields = (body, fields) =>
  fields.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

const reviewsInclude = {
  model: Review,
  as: "reviews",
  attributes: { exclude: ["productId"] },
};

// Recalculate ratings and numOfReviews from the reviews table
const recalculateRatings = async (product, transaction) => {
  const reviews = await Review.findAll({
    where: { productId: product.id },
    attributes: ["rating"],
    transaction,
  });

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = reviews.length === 0 ? 0 : avg / reviews.length;
  product.numOfReviews = reviews.length;

  await product.save({ transaction, validate: false });
};

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images || [];
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const product = await Product.create({
    ...pickFields(req.body, PRODUCT_FIELDS),
    images: imagesLinks,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.count();

  const apiFeature = new ApiFeatures(Product, req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const { count: filteredProductsCount, rows: products } =
    await Product.findAndCountAll({
      ...apiFeature.toFindOptions(),
      order: [["createdAt", "ASC"]],
    });

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin / Seller)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const whereClause =
    req.user.role === "seller" ? { user: req.user.id } : {};

  let products = await Product.findAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });

  // Fallback: If seller hasn't created specific products yet, display store catalog
  if (req.user.role === "seller" && products.length === 0) {
    products = await Product.findAll({ order: [["createdAt", "DESC"]] });
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id, {
    include: [reviewsInclude],
    order: [[{ model: Review, as: "reviews" }, "createdAt", "ASC"]],
  });

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Strict Seller Scoping: Sellers can only edit products they own
  if (
    req.user.role === "seller" &&
    product.user &&
    String(product.user) !== String(req.user.id)
  ) {
    return next(
      new ErrorHander("Access denied. You can only modify your own products.", 403)
    );
  }

  const updates = pickFields(req.body, PRODUCT_FIELDS);

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    updates.images = imagesLinks;
  }

  await product.update(updates);

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByPk(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Strict Seller Scoping: Sellers can only delete products they own
  if (
    req.user.role === "seller" &&
    product.user &&
    String(product.user) !== String(req.user.id)
  ) {
    return next(
      new ErrorHander("Access denied. You can only delete your own products.", 403)
    );
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // Reviews are removed by ON DELETE CASCADE
  await product.destroy();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await sequelize.transaction(async (transaction) => {
    const existingReview = await Review.findOne({
      where: { productId: product.id, user: req.user.id },
      transaction,
    });

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment;
      await existingReview.save({ transaction });
    } else {
      await Review.create(
        {
          productId: product.id,
          user: req.user.id,
          name: req.user.name,
          rating: Number(rating),
          comment,
        },
        { transaction }
      );
    }

    await recalculateRatings(product, transaction);
  });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByPk(req.query.id, {
    include: [reviewsInclude],
    order: [[{ model: Review, as: "reviews" }, "createdAt", "ASC"]],
  });

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findByPk(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  await sequelize.transaction(async (transaction) => {
    await Review.destroy({
      where: { id: req.query.id, productId: product.id },
      transaction,
    });

    await recalculateRatings(product, transaction);
  });

  res.status(200).json({
    success: true,
  });
});
