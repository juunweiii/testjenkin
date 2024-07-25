import {
    SUBMIT_REQUEST_BEGIN,
    SUBMIT_REQUEST_SUCCESS,
    SUBMIT_REQUEST_ERROR,
  } from '../actions';
  
  const checkout_reducer = (state, action) => {
    if (action.type === SUBMIT_REQUEST_BEGIN) {
      return { ...state, isLoading: true };
    }
    if (action.type === SUBMIT_REQUEST_SUCCESS) {
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'success',
        alertText: 'Request submitted successfully!',
      };
    }
    if (action.type === SUBMIT_REQUEST_ERROR) {
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertType: 'danger',
        alertText: action.payload.msg,
      };
    }
    throw new Error(`No Matching "${action.type}" - action type`);
  };
  
  export default checkout_reducer;
  