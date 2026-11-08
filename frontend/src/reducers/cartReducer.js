import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

const getItemKey = (item) => `${item.product}_${item.sku || ""}`;

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload;
      const targetKey = getItemKey(item);

      const isItemExist = state.cartItems.find(
        (i) => getItemKey(i) === targetKey
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            getItemKey(i) === targetKey ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (i) => i.product !== action.payload && getItemKey(i) !== action.payload
        ),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
