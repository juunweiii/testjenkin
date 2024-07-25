import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/cart_reducer'
import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  ADD_ADOPTION_REQUEST,
} from '../actions'

const getLocalStorage = () => {
  let cart = localStorage.getItem('cart')
  if (cart) {
    return JSON.parse(localStorage.getItem('cart'))
  } else {
    return []
  }
}

const initialState = {
  cart: getLocalStorage(),
  total_items: 0,
  total_amount: 0,
  adoption_requests: getLocalStorage('adoption_requests'),
}

const CartContext = React.createContext()

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  // add to cart
  const addToCart = (id, pet) => {
    dispatch({ type: ADD_TO_CART, payload: { id, pet } })
  }
  // remove item
  const removeItem = (id) => {
    dispatch({ type: REMOVE_CART_ITEM, payload: id })
  }
  // clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART })
  }

  //Processing of adoption request by users
  const addAdoptionRequest = (pet) => {
    dispatch({ type: ADD_ADOPTION_REQUEST, payload: pet });
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
    localStorage.setItem('adoption_requests', JSON.stringify(state.adoption_requests));
    dispatch({ type: COUNT_CART_TOTALS });
  }, [state.cart, state.adoption_requests]);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeItem, clearCart, addAdoptionRequest }}
    >
      {children}
    </CartContext.Provider>
  );
}

// make sure use
export const useCartContext = () => {
  return useContext(CartContext)
}
