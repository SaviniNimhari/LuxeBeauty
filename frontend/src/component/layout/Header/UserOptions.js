import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import StorefrontIcon from "@material-ui/icons/Storefront";
import PersonIcon from "@material-ui/icons/Person";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);

  const [open, setOpen] = useState(false);
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();

  const options = [
    { icon: <DashboardIcon />, name: "Customer Dashboard", func: userDashboard },
    { icon: <FavoriteIcon style={{ color: "#ec4899" }} />, name: "Wishlist", func: wishlist },
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems && cartItems.length > 0 ? "#9333ea" : "unset" }}
        />
      ),
      name: `Cart(${cartItems ? cartItems.length : 0})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <AssessmentIcon />,
      name: "Admin Dashboard",
      func: adminDashboard,
    });
  }

  if (user.role === "seller" || user.role === "admin") {
    options.unshift({
      icon: <StorefrontIcon />,
      name: "Seller Dashboard",
      func: sellerDashboard,
    });
  }

  function userDashboard() {
    history.push("/dashboard");
  }

  function wishlist() {
    history.push("/wishlist");
  }

  function sellerDashboard() {
    history.push("/seller/dashboard");
  }

  function adminDashboard() {
    history.push("/admin/dashboard");
  }

  function orders() {
    history.push("/orders");
  }
  function account() {
    history.push("/account");
  }
  function cart() {
    history.push("/cart");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar && user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
