import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import ShoppingBagIcon from "@material-ui/icons/LocalMall";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  const increaseQuantity = (id, quantity, stock, variant) => {
    if (!isAuthenticated) {
      alert.error("Please login to update cart");
      history.push("/login?redirect=cart");
      return;
    }
    const newQty = quantity + 1;
    if (stock <= quantity) {
      alert.info("Maximum available stock reached for this item");
      return;
    }
    dispatch(addItemsToCart(id, newQty, variant));
  };

  const decreaseQuantity = (id, quantity, variant) => {
    if (!isAuthenticated) {
      alert.error("Please login to update cart");
      history.push("/login?redirect=cart");
      return;
    }
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty, variant));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=shipping");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const freeShippingThreshold = 2000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingAmount = isFreeShipping || subtotal === 0 ? 0 : 200;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  return (
    <Fragment>
      <MetaData title="Shopping Bag -- LUXEBEAUTY" />

      {cartItems.length === 0 ? (
        <div className="emptyCartContainer">
          <div className="emptyCartCard">
            <div className="emptyCartIconCircle">
              <RemoveShoppingCartIcon style={{ fontSize: "3rem", color: "#c084fc" }} />
            </div>
            <h2 className="emptyCartTitle">Your Shopping Bag is Empty</h2>
            <p className="emptyCartSubtitle">
              Discover our artisanal makeup, radiant skincare, and luxury fragrances to fill your vanity.
            </p>
            <Link to="/products" className="emptyCartExploreBtn">
              Explore Luxury Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="cartPageWrapper">
          <div className="cartHeaderSection">
            <h1 className="cartPageTitle">
              <ShoppingBagIcon style={{ fontSize: "2rem", color: "#9333ea" }} />
              Shopping Bag <span>({cartItems.length} items)</span>
            </h1>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="freeShippingBanner">
            <p className="freeShippingText">
              {isFreeShipping ? (
                <span>🎉 Congratulations! You have unlocked <strong>FREE Luxury Delivery</strong>!</span>
              ) : (
                <span>
                  Add <strong>Rs. {(freeShippingThreshold - subtotal).toLocaleString()}</strong> more to qualify for <strong>FREE Delivery</strong>!
                </span>
              )}
            </p>
            <div className="freeShippingProgressBar">
              <div
                className="freeShippingProgressFill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="cartMainLayout">
            {/* Left Items Column */}
            <div className="cartItemsColumn">
              <div className="cartItemsListHeader">
                <span>Product</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {cartItems.map((item) => {
                const lineTotal = item.quantity * item.price;
                return (
                  <div className="cartItemRow" key={item.sku || item.product}>
                    <div className="cartItemProductCol">
                      <CartItemCard
                        item={item}
                        deleteCartItems={deleteCartItems}
                      />
                    </div>

                    <div className="cartItemQuantityCol">
                      <div className="quantityStepper">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.product,
                              item.quantity,
                              item.variant
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input readOnly type="number" value={item.quantity} />
                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.product,
                              item.quantity,
                              item.stock,
                              item.variant
                            )
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cartItemTotalCol">
                      <span className="lineItemTotal">
                        Rs. {Number(lineTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Sticky Order Summary Column */}
            <div className="cartSummaryColumn">
              <div className="orderSummaryCard">
                <h3 className="summaryTitle">Order Summary</h3>

                <div className="summaryRow">
                  <span>Bag Subtotal</span>
                  <span>Rs. {Number(subtotal).toLocaleString()}</span>
                </div>

                <div className="summaryRow">
                  <span>Standard Delivery</span>
                  <span>
                    {shippingAmount === 0 ? (
                      <strong style={{ color: "#059669" }}>FREE</strong>
                    ) : (
                      `Rs. ${shippingAmount}`
                    )}
                  </span>
                </div>

                <div className="summaryDivider" />

                <div className="summaryRow totalRow">
                  <span>Estimated Total</span>
                  <span className="summaryTotalAmount">
                    Rs. {Number(subtotal + shippingAmount).toLocaleString()}
                  </span>
                </div>

                <p className="summaryTaxNote">
                  * Applicable GST taxes and promo coupons will be calculated at checkout.
                </p>

                <button
                  type="button"
                  className="checkoutProceedBtn"
                  onClick={checkoutHandler}
                >
                  <LockOutlinedIcon style={{ fontSize: "1.1rem" }} />
                  <span>Proceed to Checkout</span>
                  <ArrowForwardIcon style={{ fontSize: "1.1rem" }} />
                </button>

                <div className="cartGuarantees">
                  <span>✦ 100% Authentic Luxury Guarantee</span>
                  <span>✦ Safe & Encrypted Stripe Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
