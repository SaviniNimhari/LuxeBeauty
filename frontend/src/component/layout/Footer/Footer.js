import React from "react";
import { Link } from "react-router-dom";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";
import { FaInstagram, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Get exclusive deals on the LuxeBeauty app</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>LuxeBeauty.</h1>
        <p>Premium cosmetics crafted for every shade of beautiful</p>
        <div className="footerQuickLinks">
          <Link to="/">Home</Link>
          <Link to="/products">Cosmetics</Link>
          <Link to="/login">Sign In / Register</Link>
          <Link to="/cart">Bag</Link>
          <Link to="/contact">Support</Link>
        </div>
        <p>Copyrights 2024 &copy; Savini Peramuna</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/sav_nimhari" target="_blank" rel="noreferrer">
          <FaInstagram style={{marginRight:"0.3vmax"}}/> Instagram
        </a>
        <a href="https://www.tiktok.com/@sav_nimhari" target="_blank" rel="noreferrer">
          <FaTiktok style={{marginRight:"0.3vmax"}}/> TikTok
        </a>
        <a href="https://www.facebook.com/savini.peramuna" target="_blank" rel="noreferrer">
          <FaFacebook style={{marginRight:"0.3vmax"}}/> Facebook
        </a>
        <a href="https://www.linkedin.com/in/savini-peramuna/" target="_blank" rel="noreferrer">
          <FaLinkedin style={{marginRight:"0.3vmax"}}/> LinkedIn
        </a>
        <a href="https://github.com/SaviniNimhari" target="_blank" rel="noreferrer">
          <FaGithub style={{marginRight:"0.3vmax"}}/> GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
