import React, { useContext, useReducer } from 'react';
import axios from 'axios';
import reducer from '../reducers/checkout_reducer';
import {
  SUBMIT_REQUEST_BEGIN,
  SUBMIT_REQUEST_SUCCESS,
  SUBMIT_REQUEST_ERROR,
} from '../actions';

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
};

const CheckoutContext = React.createContext();

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const submitRequest = async (formData) => {
    dispatch({ type: SUBMIT_REQUEST_BEGIN });
    try {
      await axios.post('https://ict2216-secure-software-development.onrender.com/api/request', formData);
      dispatch({ type: SUBMIT_REQUEST_SUCCESS });
    } catch (error) {
      dispatch({
        type: SUBMIT_REQUEST_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  return (
    <CheckoutContext.Provider value={{ ...state, submitRequest }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};
