import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";

// LuxeBeauty Header Configuration
const options = {
  burgerColorHover: "#9333ea",
  logo,
  logoWidth: "20vmax",
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#9333ea",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(60, 7, 100, 0.85)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#9333ea",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIconColor: "rgba(60, 7, 100, 0.85)",
  searchIconColor: "rgba(60, 7, 100, 0.85)",
  cartIconColor: "rgba(60, 7, 100, 0.85)",
  profileIconColorHover: "#9333ea",
  searchIconColorHover: "#9333ea",
  cartIconColorHover: "#9333ea",
  cartIconMargin: "1vmax",
};

const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;
