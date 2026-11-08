import React, { Fragment, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import axios from "axios";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const ConfirmOrder = ({ history }) => {
  const alert = useAlert();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const tax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
  const totalPrice = Math.round((discountedSubtotal + tax + shippingCharges) * 100) / 100;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const applyCouponHandler = async (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      alert.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "/api/v1/coupon/validate",
        { code, orderAmount: subtotal },
        config
      );

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode(data.coupon.code);
        alert.success(`Coupon ${data.coupon.code} applied! Saved Rs. ${data.coupon.discountAmount}`);
      }
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      alert.error(msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCouponHandler = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    alert.info("Coupon removed");
  };

  const proceedToPayment = () => {
    const data = {
      subtotal,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    history.push("/process/payment");
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order - LuxeBeauty" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X Rs. {item.price} ={" "}
                      <b>Rs. {item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>Rs. {subtotal}</span>
              </div>
              {appliedCoupon && (
                <div style={{ color: "#16a34a" }}>
                  <p>Coupon Discount ({appliedCoupon.code}):</p>
                  <span>- Rs. {appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div>
                <p>Shipping Charges:</p>
                <span>{shippingCharges === 0 ? "FREE" : `Rs. ${shippingCharges}`}</span>
              </div>
              <div>
                <p>GST (18%):</p>
                <span>Rs. {tax}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="couponSection" style={{ padding: "1vmax", borderTop: "1px solid rgba(0,0,0,0.1)", borderBottom: "1px solid rgba(0,0,0,0.1)", margin: "1vmax 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5vmax", marginBottom: "0.6vmax" }}>
                <LocalOfferIcon style={{ color: "#9333ea", fontSize: "1.2vmax" }} />
                <span style={{ font: "600 0.9vmax 'Roboto'", color: "#334155" }}>Have a Promo Coupon?</span>
              </div>

              {!appliedCoupon ? (
                <div style={{ display: "flex", gap: "0.5vmax" }}>
                  <input
                    type="text"
                    placeholder="e.g. LUXE10, WELCOME20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: "0.6vmax 0.8vmax",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => applyCouponHandler()}
                    disabled={couponLoading}
                    style={{
                      background: "#9333ea",
                      color: "white",
                      border: "none",
                      padding: "0.6vmax 1.2vmax",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.6vmax 0.9vmax", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4vmax", color: "#15803d", fontSize: "0.85vmax", fontWeight: 600 }}>
                    <CheckCircleIcon style={{ fontSize: "1.1vmax" }} />
                    <span>{appliedCoupon.code} applied (-Rs. {appliedCoupon.discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCouponHandler}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "0.8vmax",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div style={{ marginTop: "0.8vmax", display: "flex", flexWrap: "wrap", gap: "0.4vmax" }}>
                  <span
                    onClick={() => applyCouponHandler("LUXE10")}
                    style={{ cursor: "pointer", background: "#f3e8ff", color: "#7e22ce", fontSize: "0.75vmax", padding: "0.2vmax 0.5vmax", borderRadius: "4px", border: "1px dashed #c084fc" }}
                  >
                    ⚡ LUXE10 (10% OFF)
                  </span>
                  <span
                    onClick={() => applyCouponHandler("WELCOME20")}
                    style={{ cursor: "pointer", background: "#f3e8ff", color: "#7e22ce", fontSize: "0.75vmax", padding: "0.2vmax 0.5vmax", borderRadius: "4px", border: "1px dashed #c084fc" }}
                  >
                    ⚡ WELCOME20 (20% OFF)
                  </span>
                  <span
                    onClick={() => applyCouponHandler("FLAT500")}
                    style={{ cursor: "pointer", background: "#f3e8ff", color: "#7e22ce", fontSize: "0.75vmax", padding: "0.2vmax 0.5vmax", borderRadius: "4px", border: "1px dashed #c084fc" }}
                  >
                    ⚡ FLAT500 (Rs. 500 OFF)
                  </span>
                </div>
              )}
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>Rs. {totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
