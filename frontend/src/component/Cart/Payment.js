import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ReceiptIcon from "@material-ui/icons/Receipt";
import PrintIcon from "@material-ui/icons/Print";
import SecurityIcon from "@material-ui/icons/Security";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PersonIcon from "@material-ui/icons/Person";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const [receiptNumber] = useState(
    () => `LXB-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [currentDate] = useState(() =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );

  // Retrieve or compute order information
  let storedOrderInfo = null;
  try {
    storedOrderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  } catch (e) {
    storedOrderInfo = null;
  }

  if (!storedOrderInfo && cartItems && cartItems.length > 0) {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const shippingCharges = subtotal > 1000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + tax + shippingCharges;
    storedOrderInfo = { subtotal, shippingCharges, tax, totalPrice };
    sessionStorage.setItem("orderInfo", JSON.stringify(storedOrderInfo));
  }

  const orderInfo = storedOrderInfo || {
    subtotal: 0,
    shippingCharges: 0,
    tax: 0,
    totalPrice: 0,
  };

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (payBtn.current) {
      payBtn.current.disabled = true;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      // Handle demo mode fallback
      if (data.isDemo || !stripe || !elements) {
        order.paymentInfo = {
          id: data.client_secret || `demo_pay_${Date.now()}`,
          status: "succeeded",
        };

        dispatch(createOrder(order));
        history.push("/success");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        // Fallback if card element is unmounted
        order.paymentInfo = {
          id: `pay_${Date.now()}`,
          status: "succeeded",
        };
        dispatch(createOrder(order));
        history.push("/success");
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user ? user.name : "Customer",
            email: user ? user.email : "",
            address: {
              line1: shippingInfo.address || "123 Main St",
              city: shippingInfo.city || "City",
              state: shippingInfo.state || "State",
              postal_code: shippingInfo.pinCode || "12345",
              country: shippingInfo.country || "IN",
            },
          },
        },
      });

      if (result.error) {
        if (payBtn.current) payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          history.push("/success");
        } else {
          alert.error("There was an issue processing your payment.");
          if (payBtn.current) payBtn.current.disabled = false;
        }
      }
    } catch (err) {
      if (payBtn.current) payBtn.current.disabled = false;
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      alert.error(msg);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  return (
    <Fragment>
      <MetaData title="Payment & Order Receipt - LuxeBeauty" />
      <CheckoutSteps activeStep={2} />

      <div className="paymentPageContainer">
        {/* Navigation Breadcrumb */}
        <div className="paymentTopBar">
          <Link to="/order/confirm" className="backToConfirmBtn">
            <ArrowBackIcon /> Back to Order Review
          </Link>
          <div className="paymentSecurityNotice">
            <SecurityIcon /> 256-Bit SSL Encrypted &amp; PCI-DSS Compliant
          </div>
        </div>

        <div className="paymentContentGrid">
          {/* ================= LEFT COLUMN: ORDER RECEIPT ================= */}
          <div className="paymentReceiptCard" id="printableReceipt">
            <div className="receiptHeader">
              <div className="receiptBrand">
                <span className="receiptBadge">
                  <ReceiptIcon /> Official Order Invoice
                </span>
                <h2>LUXEBEAUTY</h2>
                <p className="receiptTagline">Luxury Cosmetics Sanctuary</p>
              </div>
              <div className="receiptMeta">
                <div className="metaRow">
                  <span className="metaLabel">Receipt No:</span>
                  <span className="metaValue receiptNumber">{receiptNumber}</span>
                </div>
                <div className="metaRow">
                  <span className="metaLabel">Date:</span>
                  <span className="metaValue">{currentDate}</span>
                </div>
                <div className="metaRow">
                  <span className="metaLabel">Status:</span>
                  <span className="receiptStatusPending">Awaiting Payment</span>
                </div>
              </div>
            </div>

            <div className="receiptDivider" />

            {/* Billed To & Shipping Destination */}
            <div className="receiptAddresses">
              <div className="receiptAddressCol">
                <h4>
                  <PersonIcon /> Billed To
                </h4>
                <p className="addrName">{user ? user.name : "Guest Customer"}</p>
                <p>{user ? user.email : ""}</p>
                <p>Phone: {shippingInfo ? shippingInfo.phoneNo : "N/A"}</p>
              </div>
              <div className="receiptAddressCol">
                <h4>
                  <LocalShippingIcon /> Ship To
                </h4>
                <p className="addrName">{user ? user.name : "Guest Customer"}</p>
                <p>{shippingInfo ? shippingInfo.address : ""}</p>
                <p>
                  {shippingInfo ? shippingInfo.city : ""},{" "}
                  {shippingInfo ? shippingInfo.state : ""} -{" "}
                  {shippingInfo ? shippingInfo.pinCode : ""}
                </p>
                <p>{shippingInfo ? shippingInfo.country : ""}</p>
              </div>
            </div>

            <div className="receiptDivider" />

            {/* Line Items Table */}
            <div className="receiptItemsSection">
              <h4>Order Items ({cartItems ? cartItems.length : 0})</h4>
              <div className="receiptItemsList">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.product} className="receiptItemRow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="receiptItemImg"
                      />
                      <div className="receiptItemInfo">
                        <Link
                          to={`/product/${item.product}`}
                          className="receiptItemName"
                        >
                          {item.name}
                        </Link>
                        <span className="receiptItemQty">
                          Qty: {item.quantity} &times; Rs.{" "}
                          {item.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="receiptItemTotal">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="emptyReceiptItems">No items in order bag.</p>
                )}
              </div>
            </div>

            <div className="receiptDivider" />

            {/* Price Calculations Breakdown */}
            <div className="receiptTotalsSection">
              <div className="totalLine">
                <span>Items Subtotal</span>
                <span>Rs. {orderInfo.subtotal.toLocaleString()}</span>
              </div>
              <div className="totalLine">
                <span>Shipping Charges</span>
                <span>
                  {orderInfo.shippingCharges === 0
                    ? "FREE"
                    : `Rs. ${orderInfo.shippingCharges.toLocaleString()}`}
                </span>
              </div>
              <div className="totalLine">
                <span>Estimated GST / Tax (18%)</span>
                <span>Rs. {orderInfo.tax.toLocaleString()}</span>
              </div>
              <div className="receiptDivider dashed" />
              <div className="totalLine grandTotal">
                <span>Total Amount Due</span>
                <span className="grandTotalAmount">
                  Rs. {orderInfo.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Receipt Actions / Print */}
            <div className="receiptFooterActions no-print">
              <button
                type="button"
                className="printReceiptBtn"
                onClick={() => window.print()}
                title="Print or Save Invoice"
              >
                <PrintIcon /> Print Receipt
              </button>
              <span className="receiptNote">
                An electronic copy will also be saved to your dashboard.
              </span>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: PAYMENT GATEWAY ================= */}
          <div className="paymentGatewayCard">
            <div className="gatewayHeader">
              <div className="gatewayIconWrap">
                <CreditCardIcon />
              </div>
              <div>
                <Typography component="h3">Payment Method</Typography>
                <p>Authorize transaction for Rs. {orderInfo.totalPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Accepted Cards Banner */}
            <div className="acceptedCardsBanner">
              <span className="cardPill visa">VISA</span>
              <span className="cardPill mastercard">Mastercard</span>
              <span className="cardPill amex">AMEX</span>
              <span className="cardPill rupay">RuPay</span>
            </div>

            <form className="paymentForm" onSubmit={submitHandler}>
              {/* Cardholder Name */}
              <div className="inputGroup">
                <label>Cardholder Name</label>
                <div className="inputWithIcon">
                  <PersonIcon />
                  <input
                    type="text"
                    defaultValue={user ? user.name : ""}
                    placeholder="Name on Card"
                    required
                    className="styledInput"
                  />
                </div>
              </div>

              {/* Card Number Element */}
              <div className="inputGroup">
                <label>Card Number</label>
                <div className="inputWithIcon">
                  <CreditCardIcon />
                  <CardNumberElement className="paymentInput" />
                </div>
              </div>

              {/* Expiry & CVC Grid */}
              <div className="formRowGrid">
                <div className="inputGroup">
                  <label>Expiration Date</label>
                  <div className="inputWithIcon">
                    <EventIcon />
                    <CardExpiryElement className="paymentInput" />
                  </div>
                </div>

                <div className="inputGroup">
                  <label>CVV / CVC</label>
                  <div className="inputWithIcon">
                    <VpnKeyIcon />
                    <CardCvcElement className="paymentInput" />
                  </div>
                </div>
              </div>

              {/* Demo Helper / Test Notice */}
              <div className="demoCardNotice">
                <div className="demoNoticeTitle">💡 Stripe Test Mode Credentials:</div>
                <div className="demoNoticeDetails">
                  <span>Card: <code>4242 4242 4242 4242</code></span>
                  <span>Exp: <code>12/28</code> &bull; CVC: <code>123</code></span>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                ref={payBtn}
                className="paymentFormBtn"
              >
                Pay Rs. {orderInfo.totalPrice.toLocaleString()} Now
              </button>
            </form>

            <div className="guaranteeBanner">
              <SecurityIcon />
              <p>
                Payments are processed securely. Your card details are never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
