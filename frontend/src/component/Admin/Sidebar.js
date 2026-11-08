import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import ListAltIcon from "@material-ui/icons/ListAlt";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import RateReviewIcon from "@material-ui/icons/RateReview";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PersonIcon from "@material-ui/icons/Person";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const isSeller = user && user.role === "seller";
  const isAdmin = user && user.role === "admin";

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="LuxeBeauty" />
      </Link>

      {isAdmin && (
        <Link to="/admin/dashboard">
          <p>
            <DashboardIcon /> Admin Dashboard
          </p>
        </Link>
      )}

      {(isSeller || isAdmin) && (
        <Link to="/seller/dashboard">
          <p>
            <StorefrontIcon /> Seller Dashboard
          </p>
        </Link>
      )}

      <Link to="/dashboard">
        <p>
          <PersonIcon /> Customer Portal
        </p>
      </Link>

      <div className="sidebarDivider" style={{ margin: "10px 0", borderTop: "1px solid #e2e8f0" }} />

      <div style={{ padding: "0 1rem" }}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ImportExportIcon />}
        >
          <TreeItem nodeId="1" label="Products">
            <Link to="/admin/products">
              <TreeItem nodeId="2" label="All Products" icon={<PostAddIcon />} />
            </Link>

            <Link to="/admin/product">
              <TreeItem nodeId="3" label="Create Product" icon={<AddIcon />} />
            </Link>
          </TreeItem>
        </TreeView>
      </div>

      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>

      {isAdmin && (
        <Link to="/admin/users">
          <p>
            <PeopleIcon /> Users
          </p>
        </Link>
      )}

      {isAdmin && (
        <Link to="/admin/reviews">
          <p>
            <RateReviewIcon />
            Reviews
          </p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
