import React, { useEffect } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Doughnut, Line } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PersonIcon from "@material-ui/icons/Person";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.allUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  let adminsCount = 0;
  let sellersCount = 0;
  let customersCount = 0;

  users &&
    users.forEach((item) => {
      if (item.role === "admin") adminsCount += 1;
      else if (item.role === "seller") sellersCount += 1;
      else customersCount += 1;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
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
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#ef4444", "#10b981"],
        hoverBackgroundColor: ["#dc2626", "#059669"],
        data: [outOfStock, (products ? products.length : 0) - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Admin Master Control Panel</Typography>

        {/* Portal Switcher Shortcuts */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
          <Link
            to="/seller/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ede9fe",
              color: "#6b21a8",
              padding: "0.6rem 1.2rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <StorefrontIcon style={{ fontSize: "1.1rem" }} /> Go to Seller Dashboard
          </Link>
          <Link
            to="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f3e8ff",
              color: "#581c87",
              padding: "0.6rem 1.2rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            <PersonIcon style={{ fontSize: "1.1rem" }} /> Go to Customer Portal
          </Link>
        </div>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Gross Revenue <br /> Rs. {totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p>Products</p>
              <p>{products && products.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>
            <Link to="/admin/users">
              <p>Total Users</p>
              <p>{users && users.length}</p>
            </Link>
          </div>
        </div>

        {/* User Role Demographics */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", margin: "1.5rem auto 2.5rem auto", flexWrap: "wrap", maxWidth: "800px" }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1rem 1.5rem", borderRadius: "12px", textAlign: "center", minWidth: "150px" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Customers</span>
            <h3 style={{ margin: "0.3rem 0 0", color: "#7c3aed", fontSize: "1.5rem" }}>{customersCount}</h3>
          </div>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1rem 1.5rem", borderRadius: "12px", textAlign: "center", minWidth: "150px" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Sellers</span>
            <h3 style={{ margin: "0.3rem 0 0", color: "#2563eb", fontSize: "1.5rem" }}>{sellersCount}</h3>
          </div>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "1rem 1.5rem", borderRadius: "12px", textAlign: "center", minWidth: "150px" }}>
            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Admins</span>
            <h3 style={{ margin: "0.3rem 0 0", color: "#d97706", fontSize: "1.5rem" }}>{adminsCount}</h3>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
