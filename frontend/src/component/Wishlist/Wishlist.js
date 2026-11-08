import React, { Fragment, useEffect } from "react";
import "./wishlist.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ShoppingBagIcon from "@material-ui/icons/LocalMall";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Rating } from "@material-ui/lab";
import { getWishlist, removeFromWishlist, clearErrors } from "../../actions/wishlistAction";
import { addItemsToCart } from "../../actions/cartAction";

const Wishlist = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated } = useSelector((state) => state.user);
  const { wishlist, loading, error, message } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    if (isAuthenticated === false) {
      history.push("/login?redirect=wishlist");
      return;
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);
      dispatch(clearErrors());
    }

    dispatch(getWishlist());
  }, [dispatch, alert, error, message, isAuthenticated, history]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToBag = (product) => {
    if (product.Stock < 1) {
      alert.error("This product is currently out of stock.");
      return;
    }
    dispatch(addItemsToCart(product.id || product._id, 1));
    alert.success("Added to your shopping bag!");
  };

  return (
    <Fragment>
      <MetaData title="My Wishlist - LuxeBeauty" />

      {loading ? (
        <Loader />
      ) : (
        <div className="wishlistContainer">
          <div className="wishlistHeader">
            <div className="wishlistTitleWrap">
              <span className="wishlistBadge">
                <FavoriteIcon /> Saved Sanctuary
              </span>
              <h1>My Beauty Wishlist</h1>
              <p>Keep track of your favorite cosmetics and easily move them to your bag.</p>
            </div>
            <div className="wishlistCountPill">
              <span>{wishlist ? wishlist.length : 0} items saved</span>
            </div>
          </div>

          {wishlist && wishlist.length > 0 ? (
            <div className="wishlistGrid">
              {wishlist.map((item) => {
                const prodId = item.id || item._id;
                const imgUrl =
                  item.images && item.images[0] && item.images[0].url
                    ? item.images[0].url
                    : "/Profile.png";

                return (
                  <div key={prodId} className="wishlistCard">
                    <button
                      className="wishlistRemoveBtn"
                      onClick={() => handleRemove(prodId)}
                      title="Remove from Wishlist"
                    >
                      <DeleteOutlineIcon />
                    </button>

                    <Link to={`/product/${prodId}`} className="wishlistImgLink">
                      <img src={imgUrl} alt={item.name} className="wishlistImg" />
                    </Link>

                    <div className="wishlistBody">
                      <span className="wishlistCat">{item.category || "Cosmetics"}</span>
                      <Link to={`/product/${prodId}`} className="wishlistProdTitle">
                        {item.name}
                      </Link>

                      <div className="wishlistRating">
                        <Rating
                          value={item.ratings || 0}
                          precision={0.5}
                          size="small"
                          readOnly
                        />
                        <span>({item.numOfReviews || 0})</span>
                      </div>

                      <div className="wishlistPriceRow">
                        <span className="wishlistPrice">Rs. {Number(item.price).toLocaleString()}</span>
                        <span
                          className={`stockStatus ${
                            item.Stock > 0 ? "inStock" : "outStock"
                          }`}
                        >
                          {item.Stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <button
                        className="moveToBagBtn"
                        disabled={item.Stock < 1}
                        onClick={() => handleMoveToBag(item)}
                      >
                        <ShoppingBagIcon />
                        <span>{item.Stock > 0 ? "Move to Bag" : "Out of Stock"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="emptyWishlist">
              <div className="emptyWishlistIcon">
                <FavoriteIcon />
              </div>
              <h2>Your Wishlist is Empty</h2>
              <p>Explore our luxury cosmetic collection and tap the heart icon to save items you love!</p>
              <Link to="/products" className="exploreBtn">
                Explore Beauty Catalog <ArrowForwardIcon />
              </Link>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default Wishlist;
