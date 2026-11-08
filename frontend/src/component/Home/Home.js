import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import ProductCardSkeleton from "../layout/Loader/ProductCardSkeleton";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="LuxeBeauty — Premium Cosmetics" />

      <div className="banner">
        <div className="bannerOverlay"></div>
        <div className="bannerContent">
          <p className="bannerTag">✦ Premium Beauty Collection ✦</p>
          <h1>
            Discover Your <span className="bannerHighlight">Glow</span>
          </h1>
          <p className="bannerSub">
            Luxury cosmetics crafted for every shade of beautiful
          </p>
          <a href="#container">
            <button className="bannerBtn">
              Shop Now <CgMouse />
            </button>
          </a>
        </div>
      </div>

      <div className="featuredSection">
        <div className="featuredHeader">
          <span className="featuredBadge">✦ Bestsellers ✦</span>
          <h2 className="homeHeading">Featured Products</h2>
          <p className="featuredSub">
            Handpicked luxury beauty essentials just for you
          </p>
        </div>

        <div className="container" id="container">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={`skeleton-${i}`} />
              ))
            : products &&
              products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
