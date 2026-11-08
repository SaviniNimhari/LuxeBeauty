import React from "react";
import { Link, useLocation } from "react-router-dom";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import "./Header.css";

const GlobalLoginButton = () => {
  const location = useLocation();

  // Hide button on auth-related pages where the user is already logging in
  const authPaths = ["/login", "/password/forgot", "/password/reset"];
  if (authPaths.some((p) => location.pathname.startsWith(p))) {
    return null;
  }

  return (
    <Link to="/login" className="globalLoginBtn" title="Sign In to LuxeBeauty">
      <PersonOutlineIcon className="globalLoginIcon" />
      <span>Sign In</span>
    </Link>
  );
};

export default GlobalLoginButton;
