import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import ProductCardSkeleton from "../layout/Loader/ProductCardSkeleton";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";

const categories = [
  "Lipstick",
  "Foundation",
  "Eyeshadow",
  "Mascara",
  "Blush",
  "Skincare",
  "Fragrance",
];

const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  return (
    <Fragment>
      <MetaData title="Explore Luxury Beauty -- LUXEBEAUTY" />

      <div className="productsHeaderBanner">
        <h1 className="productsMainHeading">Curated Beauty Collection</h1>
        <p className="productsSubHeading">
          Immerse yourself in artisanal cosmetics, high-performance skincare, and iconic fragrances
        </p>
      </div>

          <div className="productsPageContainer">
            {/* Filter Sidebar */}
            <aside className="filterBox">
              <div className="filterBoxHeader">
                <h3 className="filterTitle">Refine By</h3>
                {(category || ratings > 0 || price[0] > 0 || price[1] < 25000) && (
                  <button
                    className="clearFiltersBtn"
                    onClick={() => {
                      setCategory("");
                      setRatings(0);
                      setPrice([0, 25000]);
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Filter */}
              <div className="filterSection">
                <Typography className="filterSectionTitle">Price Range</Typography>
                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={0}
                  max={25000}
                  style={{ color: "#9333ea" }}
                />
                <div className="priceValuesDisplay">
                  <span>Rs. {price[0].toLocaleString()}</span>
                  <span>Rs. {price[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="filterSection">
                <Typography className="filterSectionTitle">Categories</Typography>
                <ul className="categoryBox">
                  <li
                    className={`category-link ${category === "" ? "activeCategory" : ""}`}
                    onClick={() => setCategory("")}
                  >
                    All Categories
                  </li>
                  {categories.map((c) => (
                    <li
                      className={`category-link ${category === c ? "activeCategory" : ""}`}
                      key={c}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ratings Filter */}
              <div className="filterSection">
                <Typography className="filterSectionTitle">Customer Ratings</Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRatings(newRating);
                  }}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.5}
                  style={{ color: "#9333ea" }}
                />
                <div className="ratingFilterHint">
                  {ratings > 0 ? `${ratings} Stars & Above` : "All Ratings"}
                </div>
              </div>
            </aside>

            {/* Main Products Grid Area */}
            <main className="productsContentArea">
              <div className="productsGrid">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))
                ) : products && products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                  ))
                ) : (
                  <div className="noProductsFound">
                    <p className="noProductsTitle">No Products Found</p>
                    <p className="noProductsSub">
                      Try adjusting your search criteria or price filters to discover more items.
                    </p>
                  </div>
                )}
              </div>

              {resultPerPage < count && (
                <div className="paginationBox">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="1st"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                  />
                </div>
              )}
            </main>
          </div>
    </Fragment>
  );
};

export default Products;
