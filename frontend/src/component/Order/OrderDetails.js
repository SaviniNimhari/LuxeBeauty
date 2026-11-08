import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import HomeIcon from "@material-ui/icons/Home";
import PrintIcon from "@material-ui/icons/Print";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const OrderDetails = ({ match }) => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);

  const dispatch = useDispatch();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, alert, error, match.params.id]);

  // Determine current active step in tracking timeline
  // 0: Placed, 1: Paid, 2: Processing, 3: Shipped, 4: Delivered
  const getStepProgress = (status, paymentStatus) => {
    if (status === "Delivered") return 4;
    if (status === "Shipped") return 3;
    if (status === "Processing" || paymentStatus === "succeeded") return 2;
    return 1;
  };

  const currentStep = order ? getStepProgress(order.orderStatus, order.paymentInfo && order.paymentInfo.status) : 1;

  const steps = [
    { label: "Order Placed", icon: <CheckCircleIcon />, desc: "Order details received" },
    { label: "Payment Confirmed", icon: <CreditCardIcon />, desc: "Verified via Stripe" },
    { label: "Processing & Packed", icon: <AssignmentIcon />, desc: "Luxury packaging prepared" },
    { label: "Dispatched & In Transit", icon: <LocalShippingIcon />, desc: "With Luxe Express Courier" },
    { label: "Delivered", icon: <HomeIcon />, desc: "Delivered to recipient" },
  ];

  return (
    <Fragment>
      {loading || !order ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Order #${order._id || order.id} Details - LuxeBeauty`} />

          <div className="orderDetailsPage">
            <div className="orderDetailContent">
              {/* Top Navigation & Header */}
              <div className="orderDetailTopBar">
                <Link to="/orders" className="backToOrdersLink">
                  <ArrowBackIcon /> Back to All Orders
                </Link>
                <button
                  type="button"
                  className="printInvoiceBtn"
                  onClick={() => window.print()}
                >
                  <PrintIcon /> Print Invoice
                </button>
              </div>

              {/* Order Status Banner */}
              <div className="orderStatusBanner">
                <div className="orderBannerInfo">
                  <span className="orderNumberPill">
                    Order #{String(order._id || order.id).slice(0, 12)}...
                  </span>
                  <h1>Order Tracking &amp; Status</h1>
                  <p>
                    Placed on{" "}
                    {order.createdAt ? String(order.createdAt).slice(0, 10) : "Recent"} &bull;{" "}
                    <b>Total: Rs. {order.totalPrice ? order.totalPrice.toLocaleString() : 0}</b>
                  </p>
                </div>
                <div className="orderBannerBadge">
                  <span
                    className={`statusPill ${
                      order.orderStatus === "Delivered"
                        ? "pillDelivered"
                        : order.orderStatus === "Shipped"
                        ? "pillShipped"
                        : "pillProcessing"
                    }`}
                  >
                    {order.orderStatus || "Processing"}
                  </span>
                </div>
              </div>

              {/* Shipment Tracking Stepper */}
              <div className="shipmentTrackerCard">
                <div className="trackerHeader">
                  <h3>
                    <LocalShippingIcon /> Live Shipment Progress
                  </h3>
                  <span className="trackingNumber">
                    Tracking ID: LXB-TRK-{String(order._id || order.id).slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="stepperWrapper">
                  <div
                    className="stepperProgressLine"
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                  />
                  <div className="stepperSteps">
                    {steps.map((st, index) => {
                      const isCompleted = index <= currentStep;
                      const isCurrent = index === currentStep;

                      return (
                        <div
                          key={st.label}
                          className={`stepperStepItem ${
                            isCompleted ? "stepCompleted" : ""
                          } ${isCurrent ? "stepCurrent" : ""}`}
                        >
                          <div className="stepIconWrap">{st.icon}</div>
                          <span className="stepLabel">{st.label}</span>
                          <span className="stepDesc">{st.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="orderInfoGrid">
                {/* Shipping & Delivery Address */}
                <div className="infoCard">
                  <div className="infoCardHeader">
                    <LocationOnIcon />
                    <h3>Delivery Destination</h3>
                  </div>
                  <div className="infoCardBody">
                    <p className="recipientName">
                      <PersonIcon style={{ fontSize: "1rem" }} />{" "}
                      {order.user && order.user.name ? order.user.name : "Customer"}
                    </p>
                    <p className="recipientPhone">
                      <PhoneIcon style={{ fontSize: "1rem" }} />{" "}
                      {order.shippingInfo && order.shippingInfo.phoneNo}
                    </p>
                    <p className="fullAddress">
                      {order.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="infoCard">
                  <div className="infoCardHeader">
                    <CreditCardIcon />
                    <h3>Payment Summary</h3>
                  </div>
                  <div className="infoCardBody">
                    <div className="paymentRow">
                      <span>Payment Status:</span>
                      <span
                        className={`payStatusBadge ${
                          order.paymentInfo && order.paymentInfo.status === "succeeded"
                            ? "paid"
                            : "unpaid"
                        }`}
                      >
                        {order.paymentInfo && order.paymentInfo.status === "succeeded"
                          ? "PAID (Verified)"
                          : "PENDING"}
                      </span>
                    </div>
                    <div className="paymentRow">
                      <span>Transaction Ref:</span>
                      <span className="payRef">
                        {order.paymentInfo && order.paymentInfo.id
                          ? String(order.paymentInfo.id).slice(0, 18)
                          : "Stripe Online Payment"}
                      </span>
                    </div>
                    <div className="paymentRow">
                      <span>Total Paid:</span>
                      <span className="payTotalAmount">
                        Rs. {order.totalPrice ? order.totalPrice.toLocaleString() : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="orderItemsSection">
                <h3>Ordered Beauty Items ({order.orderItems ? order.orderItems.length : 0})</h3>
                <div className="orderItemsList">
                  {order.orderItems &&
                    order.orderItems.map((item) => (
                      <div key={item.product} className="orderItemRow">
                        <img src={item.image} alt={item.name} className="orderItemImg" />
                        <div className="orderItemDetails">
                          <Link to={`/product/${item.product}`} className="orderItemTitle">
                            {item.name}
                          </Link>
                          <span className="orderItemQtyPrice">
                            Quantity: {item.quantity} &times; Rs.{" "}
                            {Number(item.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="orderItemSubtotal">
                          Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
