import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { addToWishlist } from "../../actions/wishlistAction";

const ProductDetails = ({ match, history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const { isAuthenticated } = useSelector((state) => state.user);

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  const activePrice = selectedVariant && selectedVariant.price ? selectedVariant.price : (product.price || 0);
  const activeStock = selectedVariant && typeof selectedVariant.stock !== "undefined" ? selectedVariant.stock : (product.Stock || 0);
  const activeSku = selectedVariant && selectedVariant.sku ? selectedVariant.sku : (product.sku || product._id || product.id);

  const increaseQuantity = () => {
    if (activeStock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      alert.error("Please login to add items to cart");
      history.push(`/login?redirect=/product/${match.params.id}`);
      return;
    }
    dispatch(addItemsToCart(match.params.id, quantity, selectedVariant));
    alert.success("Item Added To Cart");
  };

  const addToWishlistHandler = () => {
    if (!isAuthenticated) {
      alert.error("Please login to save items to your wishlist");
      history.push(`/login?redirect=/product/${match.params.id}`);
      return;
    }
    dispatch(addToWishlist(match.params.id));
  };

  const submitReviewToggle = () => {
    if (!isAuthenticated) {
      alert.error("Please login to submit a review");
      history.push(`/login?redirect=/product/${match.params.id}`);
      return;
    }
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", match.params.id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert, reviewError, success]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- LUXEBEAUTY`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>
                  SKU: <strong style={{ color: "#7c3aed" }}>{activeSku}</strong>
                </p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="productVariantsBlock">
                  <p className="variantsHeaderTitle">
                    Select {product.variants[0].shade ? "Shade" : "Option"}:{" "}
                    <span className="selectedVariantName">
                      {selectedVariant
                        ? selectedVariant.shade || selectedVariant.size
                        : ""}
                    </span>
                  </p>
                  <div className="variantsSwatchesList">
                    {product.variants.map((v) => (
                      <button
                        key={v.id || v.sku || v.shade || v.size}
                        type="button"
                        className={`variantSwatchButton ${
                          selectedVariant && selectedVariant.sku === v.sku
                            ? "activeVariantSwatch"
                            : ""
                        }`}
                        onClick={() => setSelectedVariant(v)}
                        title={`${v.shade || v.size} - Rs. ${v.price || product.price}`}
                      >
                        {v.hexColor && (
                          <span
                            className="variantSwatchDot"
                            style={{ backgroundColor: v.hexColor }}
                          />
                        )}
                        <span>{v.shade || v.size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="detailsBlock-3">
                <h1>{`Rs. ${Number(activePrice).toLocaleString()}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={activeStock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    {isAuthenticated ? "Add to Cart" : "Sign In to Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={addToWishlistHandler}
                    style={{
                      background: "#fdf4ff",
                      color: "#c026d3",
                      border: "1px solid #f0abfc",
                      borderRadius: "20px",
                      padding: "0.5vmax 1.2vmax",
                      cursor: "pointer",
                      font: "500 0.85vmax 'Roboto'",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4vmax",
                      marginLeft: "1vmax",
                    }}
                  >
                    <FavoriteBorderIcon style={{ fontSize: "1.1vmax" }} /> Wishlist
                  </button>
                </div>

                <p>
                  Status:
                  <b className={activeStock < 1 ? "redColor" : "greenColor"}>
                    {activeStock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                  {activeStock > 0 && activeStock <= 5 && (
                    <span style={{ color: "#e11d48", marginLeft: "10px", fontSize: "0.9rem" }}>
                      (Only {activeStock} left!)
                    </span>
                  )}
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <div className="productReviewsSection">
            <div className="reviewsHeaderRow">
              <div>
                <span className="reviewsSectionBadge">✦ Verified Feedback ✦</span>
                <h2 className="luxuryReviewsHeading">Customer Reviews & Ratings</h2>
              </div>
              <button onClick={submitReviewToggle} className="writeReviewBtn">
                Write a Review
              </button>
            </div>

            <div className="ratingsBreakdownCard">
              <div className="ratingsAverageCol">
                <span className="bigRatingNum">
                  {Number(product.ratings || 0).toFixed(1)}
                </span>
                <Rating {...options} />
                <p className="ratingCountSub">
                  Based on{" "}
                  {product.reviews ? product.reviews.length : product.numOfReviews || 0}{" "}
                  verified reviews
                </p>
              </div>

              <div className="ratingsBarsCol">
                {[5, 4, 3, 2, 1].map((star) => {
                  const total =
                    (product.reviews && product.reviews.length) ||
                    product.numOfReviews ||
                    1;
                  const starCount =
                    product.reviews && product.reviews.length > 0
                      ? product.reviews.filter(
                          (r) =>
                            Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))) ===
                            star
                        ).length
                      : Math.round(Number(product.ratings || 0)) === star
                      ? total
                      : 0;
                  const pct = Math.round((starCount / total) * 100);

                  return (
                    <div className="ratingBarRow" key={star}>
                      <span className="ratingBarStarLabel">{star} ★</span>
                      <div className="ratingBarTrack">
                        <div
                          className="ratingBarFill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="ratingBarCountLabel">({starCount})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {product.reviews && product.reviews[0] ? (
              <div className="luxuryReviewsGrid">
                {product.reviews.map((review, idx) => (
                  <ReviewCard
                    key={review.id || review._id || `rev-${idx}`}
                    review={review}
                  />
                ))}
              </div>
            ) : (
              <div className="noReviewsBox">
                <p className="noReviewsTitle">No Reviews Yet</p>
                <p className="noReviewsSub">
                  Be the first to share your experience with {product.name}
                </p>
              </div>
            )}
          </div>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your experience with this luxury cosmetic..."
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit Review
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
