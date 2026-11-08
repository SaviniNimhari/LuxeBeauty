import React, { useEffect } from "react";
import Sidebar from "../Admin/Sidebar.js";
import "./sellerDashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import MetaData from "../layout/MetaData";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import StorefrontIcon from "@material-ui/icons/Storefront";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import LaunchIcon from "@material-ui/icons/Launch";

const SellerDashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
  }, [dispatch]);

  let outOfStock = 0;
  let inStock = 0;

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      } else {
        inStock += 1;
      }
    });

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Sales", "Current Revenue"],
    datasets: [
      {
        label: "TOTAL REVENUE (Rs.)",
        backgroundColor: ["#9333ea"],
        hoverBackgroundColor: ["#7e22ce"],
        borderColor: "#9333ea",
        data: [0, totalAmount],
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#ef4444", "#10b981"],
        hoverBackgroundColor: ["#dc2626", "#059669"],
        data: [outOfStock, inStock],
      },
    ],
  };

  const recentProducts = products ? products.slice(0, 5) : [];
  const recentOrders = orders ? orders.slice(0, 5) : [];

  return (
    <div className="sellerDashboard">
      <MetaData title="Seller Portal - LuxeBeauty" />
      <Sidebar />

      <div className="sellerDashboardContainer">
        {/* Top Header Banner */}
        <div className="sellerDashHeader">
          <div className="sellerDashTitle">
            <span className="sellerBadge">
              <StorefrontIcon /> LuxeBeauty Verified Merchant
            </span>
            <Typography component="h1">
              Welcome back, {user ? user.name : "Seller"} ✨
            </Typography>
            <p className="sellerSubtitle">
              Manage your cosmetics catalog, fulfill customer orders, and track revenue metrics in real time.
            </p>
          </div>

          <div className="sellerHeaderActions">
            <Link to="/admin/product" className="sellerPrimaryBtn">
              <AddCircleOutlineIcon /> Add New Product
            </Link>
            <Link to="/products" className="sellerSecondaryBtn">
              <LaunchIcon /> View Public Store
            </Link>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="sellerKpiGrid">
          <div className="sellerKpiCard kpiRevenue">
            <div className="kpiIcon">
              <TrendingUpIcon />
            </div>
            <div className="kpiInfo">
              <span className="kpiLabel">Total Revenue</span>
              <h2 className="kpiValue">Rs. {totalAmount.toLocaleString()}</h2>
              <span className="kpiHint">Gross store sales</span>
            </div>
          </div>

          <Link to="/admin/products" className="sellerKpiCard kpiProducts">
            <div className="kpiIcon">
              <PostAddIcon />
            </div>
            <div className="kpiInfo">
              <span className="kpiLabel">Active Products</span>
              <h2 className="kpiValue">{products ? products.length : 0}</h2>
              <span className="kpiHint">View all catalog items &rarr;</span>
            </div>
          </Link>

          <Link to="/admin/orders" className="sellerKpiCard kpiOrders">
            <div className="kpiIcon">
              <LocalShippingIcon />
            </div>
            <div className="kpiInfo">
              <span className="kpiLabel">Total Orders</span>
              <h2 className="kpiValue">{orders ? orders.length : 0}</h2>
              <span className="kpiHint">Manage fulfillment &rarr;</span>
            </div>
          </Link>

          <div className="sellerKpiCard kpiStock">
            <div className="kpiIcon">
              {outOfStock > 0 ? <WarningIcon /> : <CheckCircleIcon />}
            </div>
            <div className="kpiInfo">
              <span className="kpiLabel">Stock Status</span>
              <h2 className="kpiValue">{outOfStock} Out of Stock</h2>
              <span className="kpiHint">{inStock} items available</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="sellerChartsGrid">
          <div className="sellerChartBox">
            <h3>Sales & Revenue Performance</h3>
            <div className="chartWrapper">
              <Line data={lineState} />
            </div>
          </div>

          <div className="sellerChartBox">
            <h3>Inventory Stock Health</h3>
            <div className="chartWrapper doughnutWrapper">
              <Doughnut data={doughnutState} />
            </div>
          </div>
        </div>

        {/* Recent Activity: Products & Orders preview */}
        <div className="sellerTablesGrid">
          {/* Recent Products Snapshot */}
          <div className="sellerCardTable">
            <div className="sellerTableHead">
              <h3>Recently Added Products</h3>
              <Link to="/admin/products">View All ({products ? products.length : 0})</Link>
            </div>
            <div className="sellerTableBody">
              {recentProducts.length > 0 ? (
                recentProducts.map((prod) => (
                  <div key={prod.id || prod._id} className="sellerProductRow">
                    <img
                      src={
                        prod.images && prod.images[0] && prod.images[0].url
                          ? prod.images[0].url
                          : "/Profile.png"
                      }
                      alt={prod.name}
                      className="sellerProdThumb"
                    />
                    <div className="sellerProdDetails">
                      <h4>{prod.name}</h4>
                      <p>
                        <span className="sellerProdCat">{prod.category}</span> &bull; Rs. {prod.price}
                      </p>
                    </div>
                    <div className="sellerProdStock">
                      <span
                        className={`stockBadge ${
                          prod.Stock > 0 ? "inStockBadge" : "outStockBadge"
                        }`}
                      >
                        {prod.Stock > 0 ? `${prod.Stock} in stock` : "Out of Stock"}
                      </span>
                      <Link
                        to={`/admin/product/${prod.id || prod._id}`}
                        className="sellerRowEditLink"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="sellerEmptyMsg">No products listed yet.</p>
              )}
            </div>
          </div>

          {/* Recent Orders Snapshot */}
          <div className="sellerCardTable">
            <div className="sellerTableHead">
              <h3>Customer Orders Overview</h3>
              <Link to="/admin/orders">View All ({orders ? orders.length : 0})</Link>
            </div>
            <div className="sellerTableBody">
              {recentOrders.length > 0 ? (
                recentOrders.map((ord) => (
                  <div key={ord.id || ord._id} className="sellerOrderRow">
                    <div className="sellerOrderMain">
                      <span className="sellerOrderId">
                        Order #{String(ord.id || ord._id).slice(0, 8)}...
                      </span>
                      <span className="sellerOrderDate">
                        {ord.createdAt ? String(ord.createdAt).slice(0, 10) : "Recent"}
                      </span>
                    </div>
                    <div className="sellerOrderPrice">
                      Rs. {ord.totalPrice ? ord.totalPrice.toLocaleString() : 0}
                    </div>
                    <div className="sellerOrderStatus">
                      <span
                        className={`orderStatusTag ${
                          ord.orderStatus === "Delivered"
                            ? "statusDelivered"
                            : "statusProcessing"
                        }`}
                      >
                        {ord.orderStatus || "Processing"}
                      </span>
                      <Link
                        to={`/admin/order/${ord.id || ord._id}`}
                        className="sellerRowEditLink"
                      >
                        Process
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="sellerEmptyMsg">No orders received yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
