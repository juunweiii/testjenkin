import {
    LOGOUT_USER
  } from '../actions';
const logoutreducer = (state,action) => {
    switch (action.type){

case LOGOUT_USER:
    return {
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
    };
}};
export default logoutreducer;