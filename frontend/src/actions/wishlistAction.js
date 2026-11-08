import axios from "axios";
import {
  GET_WISHLIST_REQUEST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAIL,
  REMOVE_FROM_WISHLIST_REQUEST,
  REMOVE_FROM_WISHLIST_SUCCESS,
  REMOVE_FROM_WISHLIST_FAIL,
  CLEAR_ERRORS,
} from "../constants/wishlistConstants";

// Get user wishlist
export const getWishlist = () => async (dispatch) => {
  try {
    dispatch({ type: GET_WISHLIST_REQUEST });

    const { data } = await axios.get("/api/v1/wishlist/me");

    dispatch({
      type: GET_WISHLIST_SUCCESS,
      payload: data.wishlist,
    });
  } catch (error) {
    dispatch({
      type: GET_WISHLIST_FAIL,
      payload:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add item to wishlist
export const addToWishlist = (productId) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_WISHLIST_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post("/api/v1/wishlist/add", { productId }, config);

    dispatch({
      type: ADD_TO_WISHLIST_SUCCESS,
      payload: data.message,
    });

    dispatch(getWishlist());
  } catch (error) {
    dispatch({
      type: ADD_TO_WISHLIST_FAIL,
      payload:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Remove item from wishlist
export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_WISHLIST_REQUEST });

    const { data } = await axios.delete(`/api/v1/wishlist/remove/${productId}`);

    dispatch({
      type: REMOVE_FROM_WISHLIST_SUCCESS,
      payload: data.message,
    });

    dispatch(getWishlist());
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_WISHLIST_FAIL,
      payload:
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
