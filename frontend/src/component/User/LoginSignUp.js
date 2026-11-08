import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from "../../actions/userAction";
import { useAlert } from "react-alert";
import logo from "../../images/logo.png";

const LoginSignUp = ({ history, location }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const rawRedirect = location.search ? location.search.split("=")[1] : "/dashboard";
  const redirect = rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, alert, history, isAuthenticated, redirect]);

  const switchTabs = (e, tab) => {
    setActiveTab(tab);
    if (tab === "login") {
      if (switcherTab.current) {
        switcherTab.current.classList.add("shiftToNeutral");
        switcherTab.current.classList.remove("shiftToRight");
      }
      if (registerTab.current) {
        registerTab.current.classList.remove("shiftToNeutralForm");
      }
      if (loginTab.current) {
        loginTab.current.classList.remove("shiftToLeft");
      }
    }
    if (tab === "register") {
      if (switcherTab.current) {
        switcherTab.current.classList.add("shiftToRight");
        switcherTab.current.classList.remove("shiftToNeutral");
      }
      if (registerTab.current) {
        registerTab.current.classList.add("shiftToNeutralForm");
      }
      if (loginTab.current) {
        loginTab.current.classList.add("shiftToLeft");
      }
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <Link to="/" className="loginBackBtn" title="Back to LuxeBeauty Store">
              <ArrowBackIcon />
              <span>Back to Store</span>
            </Link>

            <div className="LoginSignUpBox">
              <div className="loginBrandHeader">
                <Link to="/">
                  <img src={logo} alt="LuxeBeauty" className="loginBrandLogo" />
                </Link>
                <p className="loginBrandSubtitle">Welcome to your luxury beauty sanctuary</p>
              </div>

              <div className="loginToggleWrapper">
                <div className="login_signUp_toggle">
                  <p
                    className={activeTab === "login" ? "activeTab" : ""}
                    onClick={(e) => switchTabs(e, "login")}
                  >
                    LOGIN
                  </p>
                  <p
                    className={activeTab === "register" ? "activeTab" : ""}
                    onClick={(e) => switchTabs(e, "register")}
                  >
                    REGISTER
                  </p>
                </div>
                <button
                  ref={switcherTab}
                  className="switcherTabBtn"
                  aria-label="Tab indicator"
                ></button>
              </div>

              <div className="formsWrapper">
                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                  <div className="loginEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="loginPassword">
                    <LockOpenIcon />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Link to="/password/forgot" className="forgotPasswordLink">
                    Forgot Password?
                  </Link>
                  <input type="submit" value="Sign In" className="loginBtn" />
                </form>

                <form
                  className="signUpForm"
                  ref={registerTab}
                  encType="multipart/form-data"
                  onSubmit={registerSubmit}
                >
                  <div className="signUpName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      name="name"
                      value={name}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      name="email"
                      value={email}
                      onChange={registerDataChange}
                    />
                  </div>
                  <div className="signUpPassword">
                    <LockOpenIcon />
                    <input
                      type="password"
                      placeholder="Create Password"
                      required
                      name="password"
                      value={password}
                      onChange={registerDataChange}
                    />
                  </div>

                  <div id="registerImage">
                    <img src={avatarPreview} alt="Avatar Preview" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={registerDataChange}
                    />
                  </div>
                  <input type="submit" value="Create Account" className="signUpBtn" />
                </form>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
