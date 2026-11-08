import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const CartItemCard = ({ item, deleteCartItems }) => {
  const itemKey = item.sku || item.product;

  return (
    <div className="luxuryCartItemCard">
      <Link to={`/product/${item.product}`} className="cartItemImageWrapper">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80"
          }
          alt={item.name}
          className="cartItemThumb"
        />
      </Link>

      <div className="cartItemDetails">
        <Link to={`/product/${item.product}`} className="cartItemTitle">
          {item.name}
        </Link>

        {item.variant && (item.variant.shade || item.variant.size) && (
          <div className="cartItemVariantBadge">
            {item.variant.hexColor && (
              <span
                className="cartVariantDot"
                style={{ backgroundColor: item.variant.hexColor }}
              />
            )}
            <span>{item.variant.shade || item.variant.size}</span>
          </div>
        )}

        <div className="cartItemMeta">
          <span className="cartItemSku">SKU: {item.sku || item.product}</span>
          <span className="cartItemUnitPrice">
            Rs. {Number(item.price).toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          className="cartItemRemoveBtn"
          onClick={() => deleteCartItems(itemKey)}
          title="Remove from bag"
        >
          <DeleteOutlineIcon style={{ fontSize: "1.05rem" }} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
