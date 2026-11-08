import React from "react";
import "./aboutSection.css";
import saviniPhoto from "../../../images/savini.jpg";
import { FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const About = () => {
  return (
    <div className="aboutPage">

      {/* ── HERO ── */}
      <div className="aboutHero">
        <div className="aboutHeroOverlay"></div>
        <div className="aboutHeroContent">
          <span className="aboutBadge">✦ About Me ✦</span>
          <h1>The Person Behind <span className="aboutHighlight">LuxeBeauty</span></h1>
        </div>
      </div>

      {/* ── PROFILE CARD ── */}
      <div className="aboutBody">
        <div className="aboutProfileCard">

          <div className="aboutAvatarWrap">
            <img
              src={saviniPhoto}
              alt="Savini Peramuna"
              className="aboutAvatar"
            />
            <div className="aboutAvatarRing"></div>
          </div>

          <div className="aboutInfo">
            <h2 className="aboutName">Savini Peramuna</h2>
            <span className="aboutRole">💻 Software Developer</span>
            <span className="aboutLocation"><FaMapMarkerAlt /> Sri Lanka</span>

            <p className="aboutBio">
              Hi! I'm Savini — a passionate software developer from Sri Lanka with a love for
              building beautiful digital experiences. LuxeBeauty is my vision of blending
              technology with elegance to bring premium cosmetics to your fingertips. ✨
            </p>

            <div className="aboutSocials">
              <a href="https://www.linkedin.com/in/savini-peramuna/" target="_blank" rel="noreferrer" className="aboutSocialBtn linkedinBtn">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="https://github.com/SaviniNimhari" target="_blank" rel="noreferrer" className="aboutSocialBtn githubBtn">
                <FaGithub /> GitHub
              </a>
              <a href="https://www.instagram.com/sav_nimhari" target="_blank" rel="noreferrer" className="aboutSocialBtn instaBtn">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.tiktok.com/@sav_nimhari" target="_blank" rel="noreferrer" className="aboutSocialBtn tiktokBtn">
                <FaTiktok /> TikTok
              </a>
              <a href="https://www.facebook.com/savini.peramuna" target="_blank" rel="noreferrer" className="aboutSocialBtn facebookBtn">
                <FaFacebook /> Facebook
              </a>
              <a href="mailto:savininimhari@gmail.com" className="aboutSocialBtn emailBtn">
                <FaEnvelope /> Email
              </a>
            </div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="aboutStats">
          <div className="aboutStatItem">
            <span className="statNumber">✨</span>
            <span className="statLabel">LuxeBeauty Founder</span>
          </div>
          <div className="aboutStatItem">
            <span className="statNumber">💻</span>
            <span className="statLabel">Full Stack Developer</span>
          </div>
          <div className="aboutStatItem">
            <span className="statNumber">🇱🇰</span>
            <span className="statLabel">Based in Sri Lanka</span>
          </div>
          <div className="aboutStatItem">
            <span className="statNumber">💜</span>
            <span className="statLabel">Passionate about Tech & Beauty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
