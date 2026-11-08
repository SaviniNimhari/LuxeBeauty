import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../actions/wishlistAction";
import { useAlert } from "react-alert";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { isAuthenticated } = useSelector((state) => state.user);

  const options = {
    value: Number(product.ratings) || 0,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert.info("Please login to save items to your wishlist");
      return;
    }

    dispatch(addToWishlist(product.id || product._id));
  };

  const imageUrl =
    product.images && product.images[0] && product.images[0].url
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80";

  return (
    <Link className="productCard" to={`/product/${product._id || product.id}`}>
      <div className="productCardImageWrapper">
        <img
          className="productCardImage"
          src={imageUrl}
          alt={product.name}
          loading="lazy"
        />
        {product.category && (
          <span className="productCardCategoryBadge">{product.category}</span>
        )}
        <button
          className="productCardHeartBtn"
          onClick={handleWishlistClick}
          title="Save to Wishlist"
          type="button"
        >
          <FavoriteBorderIcon style={{ fontSize: "1.15rem" }} />
        </button>
      </div>

      <div className="productCardContent">
        <h3 className="productCardTitle" title={product.name}>
          {product.name}
        </h3>

        <div className="productCardRatingRow">
          <Rating {...options} />
          <span className="productCardReviewCount">
            ({product.numOfReviews || 0})
          </span>
        </div>

        <div className="productCardFooter">
          <span className="productCardPrice">
            Rs. {Number(product.price).toLocaleString()}
          </span>
          {typeof product.Stock !== "undefined" && (
            <span
              className={`productCardStockBadge ${
                product.Stock > 0 ? "inStock" : "outStock"
              }`}
            >
              {product.Stock > 0 ? "In Stock" : "Sold Out"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
