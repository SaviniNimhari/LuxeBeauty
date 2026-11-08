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

export const wishlistReducer = (
  state = { wishlist: [], loading: false, message: null, error: null },
  action
) => {
  switch (action.type) {
    case GET_WISHLIST_REQUEST:
    case ADD_TO_WISHLIST_REQUEST:
    case REMOVE_FROM_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        wishlist: action.payload,
      };

    case ADD_TO_WISHLIST_SUCCESS:
    case REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case GET_WISHLIST_FAIL:
    case ADD_TO_WISHLIST_FAIL:
    case REMOVE_FROM_WISHLIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};
