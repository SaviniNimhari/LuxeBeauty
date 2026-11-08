import React, { Fragment, useEffect } from "react";
import "./UserDashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { myOrders, clearErrors } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PersonIcon from "@material-ui/icons/Person";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import LockIcon from "@material-ui/icons/Lock";
import AssessmentIcon from "@material-ui/icons/Assessment";
import StorefrontIcon from "@material-ui/icons/Storefront";
import LaunchIcon from "@material-ui/icons/Launch";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const UserDashboard = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const {
    loading: ordersLoading,
    error: ordersError,
    orders,
  } = useSelector((state) => state.myOrders);

  useEffect(() => {
    if (isAuthenticated === false) {
      history.push("/login?redirect=dashboard");
    }

    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, alert, ordersError, history, isAuthenticated]);

  if (loading || !user) {
    return <Loader />;
  }

  const recentOrders = orders ? orders.slice(0, 4) : [];

  return (
    <Fragment>
      <MetaData title={`Hello, ${user.name} -- LUXEBEAUTY Dashboard`} />

      <div className="userDashboardContainer">
        {/* Top Hero Banner with Personalized Greeting */}
        <div className="userDashHero">
          <div className="userDashGreeting">
            <span className="greetingBadge">LuxeBeauty Member Portal</span>
            <h1>Hello, {user.name}! ✨</h1>
            <p>
              Welcome back to your luxury cosmetics sanctuary. Track your orders,
              review your bag, and manage your beauty profile all in one place.
            </p>
          </div>

          <div className="userDashCard">
            <img
              src={
                user.avatar && user.avatar.url
                  ? user.avatar.url
                  : "/Profile.png"
              }
              alt={user.name}
              className="userDashAvatar"
            />
            <div className="userDashProfileInfo">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span
                className={`roleBadge ${
                  user.role === "admin"
                    ? "adminBadge"
                    : user.role === "seller"
                    ? "sellerBadge"
                    : "memberBadge"
                }`}
              >
                {user.role === "admin"
                  ? "Store Administrator"
                  : user.role === "seller"
                  ? "Verified Merchant / Seller"
                  : "VIP Beauty Customer"}
              </span>
            </div>
          </div>
        </div>

        {/* Metric / KPI Cards */}
        <div className="dashStatsGrid">
          <Link to="/orders" className="dashStatCard">
            <div className="statIconWrap statIconOrders">
              <ListAltIcon />
            </div>
            <div className="statDetails">
              <h3>{orders ? orders.length : 0}</h3>
              <p>Total Orders</p>
            </div>
            <span className="statSubtext">View all orders &rarr;</span>
          </Link>

          <Link to="/cart" className="dashStatCard">
            <div className="statIconWrap statIconBag">
              <ShoppingCartIcon />
            </div>
            <div className="statDetails">
              <h3>{cartItems ? cartItems.length : 0}</h3>
              <p>Items in Bag</p>
            </div>
            <span className="statSubtext">Proceed to bag &rarr;</span>
          </Link>

          <Link to="/me/update" className="dashStatCard">
            <div className="statIconWrap statIconProfile">
              <PersonIcon />
            </div>
            <div className="statDetails">
              <h3>{user.createdAt ? String(user.createdAt).substr(0, 10) : "Active"}</h3>
              <p>Member Since</p>
            </div>
            <span className="statSubtext">Edit your profile &rarr;</span>
          </Link>

          <Link to="/products" className="dashStatCard">
            <div className="statIconWrap statIconRewards">
              <LocalMallIcon />
            </div>
            <div className="statDetails">
              <h3>Luxe VIP</h3>
              <p>Beauty Rewards</p>
            </div>
            <span className="statSubtext">Explore cosmetics &rarr;</span>
          </Link>
        </div>

        {/* Main Content Area: Quick Actions & Recent Orders */}
        <div className="dashContentGrid">
          {/* Quick Actions Panel */}
          <div className="dashQuickActions">
            <h3>Quick Actions</h3>
            <div className="quickActionsList">
              <Link to="/orders" className="quickActionBtn">
                <ListAltIcon />
                <span>My Orders History</span>
                <ArrowForwardIcon className="arrowIcon" />
              </Link>
              <Link to="/cart" className="quickActionBtn">
                <ShoppingCartIcon />
                <span>Shopping Bag ({cartItems ? cartItems.length : 0})</span>
                <ArrowForwardIcon className="arrowIcon" />
              </Link>
              <Link to="/products" className="quickActionBtn">
                <LocalMallIcon />
                <span>Shop New Cosmetics</span>
                <ArrowForwardIcon className="arrowIcon" />
              </Link>
              <Link to="/me/update" className="quickActionBtn">
                <PersonIcon />
                <span>Update Personal Info</span>
                <ArrowForwardIcon className="arrowIcon" />
              </Link>
              <Link to="/password/update" className="quickActionBtn">
                <LockIcon />
                <span>Change Password</span>
                <ArrowForwardIcon className="arrowIcon" />
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="quickActionBtn adminActionBtn">
                  <AssessmentIcon />
                  <span>Admin Control Center</span>
                  <LaunchIcon className="arrowIcon" />
                </Link>
              )}
              {user.role === "seller" && (
                <Link to="/seller/dashboard" className="quickActionBtn adminActionBtn" style={{ background: "linear-gradient(135deg, #1e1b4b, #4338ca)" }}>
                  <StorefrontIcon />
                  <span>Seller Operations Portal</span>
                  <LaunchIcon className="arrowIcon" />
                </Link>
              )}
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="dashRecentOrders">
            <div className="recentOrdersHeader">
              <h3>Recent Orders</h3>
              <Link to="/orders">View All</Link>
            </div>

            {ordersLoading ? (
              <p className="loadingOrdersText">Loading recent orders...</p>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="ordersList">
                {recentOrders.map((order) => (
                  <div key={order._id || order.id} className="orderSummaryCard">
                    <div className="orderSummaryMain">
                      <p className="orderIdText">Order #{String(order._id || order.id).substr(0, 8)}...</p>
                      <span className="orderDateText">
                        {order.createdAt ? String(order.createdAt).substr(0, 10) : "Recent"}
                      </span>
                    </div>

                    <div className="orderSummaryDetails">
                      <span className="orderAmount">
                        Rs. {order.totalPrice || order.amount || 0}
                      </span>
                      <span
                        className={`orderStatusTag ${
                          order.orderStatus === "Delivered"
                            ? "statusDelivered"
                            : "statusProcessing"
                        }`}
                      >
                        {order.orderStatus || "Processing"}
                      </span>
                      <Link
                        to={`/order/${order._id || order.id}`}
                        className="orderLinkBtn"
                        title="View Order Details"
                      >
                        <LaunchIcon />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyOrdersBox">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="startShoppingBtn">
                  Shop Luxury Makeup Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserDashboard;
