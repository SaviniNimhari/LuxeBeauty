import "./App.css";
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import GlobalLoginButton from "./component/layout/Header/GlobalLoginButton";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import UserDashboard from "./component/User/UserDashboard";
import Wishlist from "./component/Wishlist/Wishlist";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/Admin/Dashboard.js";
import SellerDashboard from "./component/Seller/SellerDashboard";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setStripeApiKey(data.stripeApiKey);
    } catch (e) {}
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />

      {isAuthenticated ? (
        <UserOptions user={user} />
      ) : (
        <GlobalLoginButton />
      )}

      <Elements stripe={loadStripe(stripeApiKey || "pk_test_TYooMQauvdEDq54NiTphI7jx")}>
        <ProtectedRoute exact path="/process/payment" component={Payment} />
      </Elements>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />

        <Route exact path="/search" component={Search} />

        <Route exact path="/contact" component={Contact} />

        <Route exact path="/about" component={About} />

        <ProtectedRoute exact path="/dashboard" component={UserDashboard} />
        <ProtectedRoute exact path="/wishlist" component={Wishlist} />

        <ProtectedRoute exact path="/account" component={Profile} />

        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />

        <ProtectedRoute
          exact
          path="/password/update"
          component={UpdatePassword}
        />

        <Route exact path="/password/forgot" component={ForgotPassword} />

        <Route exact path="/password/reset/:token" component={ResetPassword} />

        <Route exact path="/login" component={LoginSignUp} />

        <Route exact path="/cart" component={Cart} />

        <ProtectedRoute exact path="/shipping" component={Shipping} />

        <ProtectedRoute exact path="/success" component={OrderSuccess} />

        <ProtectedRoute exact path="/orders" component={MyOrders} />

        <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />

        <ProtectedRoute exact path="/order/:id" component={OrderDetails} />

        {/* Customer Dashboard */}
        <ProtectedRoute exact path="/dashboard" component={UserDashboard} />
        <ProtectedRoute exact path="/wishlist" component={Wishlist} />

        {/* Seller Dashboard & Seller Features */}
        <ProtectedRoute
          exact
          path="/seller/dashboard"
          allowedRoles={["seller", "admin"]}
          component={SellerDashboard}
        />
        <ProtectedRoute
          exact
          path="/seller/products"
          allowedRoles={["seller", "admin"]}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/seller/product"
          allowedRoles={["seller", "admin"]}
          component={NewProduct}
        />
        <ProtectedRoute
          exact
          path="/seller/orders"
          allowedRoles={["seller", "admin"]}
          component={OrderList}
        />

        {/* Admin Dashboard */}
        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />
        <ProtectedRoute
          exact
          path="/admin/products"
          allowedRoles={["admin", "seller"]}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/admin/product"
          allowedRoles={["admin", "seller"]}
          component={NewProduct}
        />

        <ProtectedRoute
          exact
          path="/admin/product/:id"
          allowedRoles={["admin", "seller"]}
          component={UpdateProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/orders"
          allowedRoles={["admin", "seller"]}
          component={OrderList}
        />
        <ProtectedRoute
          exact
          path="/admin/order/:id"
          allowedRoles={["admin", "seller"]}
          component={ProcessOrder}
        />
        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />
        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />

        <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />
      </Switch>

      <Footer />
    </Router>
  );
}

export default App;
