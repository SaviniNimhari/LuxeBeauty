import React from "react";
import "./Contact.css";
import { FaEnvelope, FaInstagram, FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className="contactPage">
      <div className="contactHero">
        <div className="contactHeroOverlay"></div>
        <div className="contactHeroContent">
          <span className="contactBadge">✦ Get In Touch ✦</span>
          <h1>Say Hello 💜</h1>
          <p>I'd love to hear from you — reach out anytime</p>
        </div>
      </div>

      <div className="contactBody">
        <div className="contactCard">
          <div className="contactIconBox">
            <FaEnvelope className="contactMainIcon" />
          </div>
          <h2>Email Me</h2>
          <p>I'm always happy to connect!</p>
          <a className="contactEmailBtn" href="mailto:savininimhari@gmail.com">
            savininimhari@gmail.com
          </a>
        </div>

        <div className="contactSocialSection">
          <h3>Find Me On</h3>
          <div className="contactSocialGrid">

            <a href="https://www.linkedin.com/in/savini-peramuna/" target="_blank" rel="noreferrer" className="socialCard linkedin">
              <FaLinkedin className="socialIcon" />
              <span className="socialLabel">LinkedIn</span>
              <span className="socialHandle">savini peramuna</span>
            </a>

            <a href="https://www.facebook.com/savini.peramuna" target="_blank" rel="noreferrer" className="socialCard facebook">
              <FaFacebook className="socialIcon" />
              <span className="socialLabel">Facebook</span>
              <span className="socialHandle">savini peramuna</span>
            </a>

            <a href="https://www.instagram.com/sav_nimhari" target="_blank" rel="noreferrer" className="socialCard instagram">
              <FaInstagram className="socialIcon" />
              <span className="socialLabel">Instagram</span>
              <span className="socialHandle">@sav_nimhari</span>
            </a>

            <a href="https://www.tiktok.com/@sav_nimhari" target="_blank" rel="noreferrer" className="socialCard tiktok">
              <FaTiktok className="socialIcon" />
              <span className="socialLabel">TikTok</span>
              <span className="socialHandle">@sav_nimhari</span>
            </a>

            <a href="https://github.com/SaviniNimhari" target="_blank" rel="noreferrer" className="socialCard github">
              <FaGithub className="socialIcon" />
              <span className="socialLabel">GitHub</span>
              <span className="socialHandle">SaviniNimhari</span>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
