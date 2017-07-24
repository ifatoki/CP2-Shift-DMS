import axios from 'axios';
import store from '../client';
import * as actionTypes from './actionTypes';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

export function addUser(user, token, role) {
  console.log('user', user);
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
  if (Object.keys(user).length < 3) {
    axios.get(`/api/v1/users/${user.id}`)
    .then(response => (
      store.dispatch({
        type: actionTypes.ADD_USER,
        payload: {
          user: response.data.user,
          role: response.data.role
        }
      })));
  } else {
    store.dispatch({
      type: actionTypes.ADD_USER,
      payload: {
        user,
        role
      }
    });
  }
}

const removeUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  return {
    type: actionTypes.REMOVE_USER
  };
};

const requestSignup = username => ({
  type: actionTypes.SIGNUP_REQUEST,
  payload: username
});

const signupSuccessful = () => ({
  type: actionTypes.SIGNUP_SUCCESSFUL
});

const signupFailed = message => ({
  type: actionTypes.SIGNUP_FAILED,
  payload: message
});

const requestLogin = username => ({
  type: actionTypes.LOGIN_REQUEST,
  payload: username
});

const loginSuccessful = () => ({
  type: actionTypes.LOGIN_SUCCESSFUL
});

const loginFailed = message => ({
  type: actionTypes.LOGIN_FAILED,
  payload: message
});

const logoutRequest = () => ({
  type: actionTypes.LOGOUT_REQUEST
});

const logoutSuccessful = () => ({
  type: actionTypes.LOGOUT_SUCCESSFUL
});

const logoutFailed = message => ({
  type: actionTypes.LOGOUT_FAILED,
  payload: message
});

function setTokenToLocalStorage(user, token, role) {
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(user));
  addUser(user, token, role);
}

export function signUserUp(userDetails) {
  const userdata = {
    firstname: userDetails.firstname,
    lastname: userDetails.lastname,
    username: userDetails.username,
    email: userDetails.email,
    password: userDetails.password,
    roleId: userDetails.roleId
  };
  return (dispatch) => {
    if (userDetails.password !== userDetails.confirmPassword) {
      dispatch(signupFailed('password mismatch'));
    } else {
      dispatch(requestSignup(userdata.username));
      return axios
        .post('/api/v1/users', userdata, config)
        .then((response) => {
          console.log(response.data);
          setTokenToLocalStorage(
            response.data.payload.user,
            response.data.payload.token,
            response.data.payload.role
          );
          dispatch(signupSuccessful());
        })
        .catch((error) => {
          dispatch(signupFailed(error.message));
        });
    }
  };
}

export function logUserIn(userDetails) {
  const userdata = {
    username: userDetails.username,
    password: userDetails.password
  };
  return (dispatch) => {
    dispatch(requestLogin(userdata.username));
    return axios
      .post('/api/v1/users/login', userdata, config)
      .then((response) => {
        setTokenToLocalStorage(
          response.data.payload.user,
          response.data.payload.token,
          response.data.payload.role
        );
        dispatch(loginSuccessful());
      })
      .catch((error) => {
        dispatch(loginFailed(error.message));
      });
  };
}

export function logUserOut() {
  return (dispatch) => {
    dispatch(logoutRequest());
    return axios
      .post('/api/v1/users/logout', config)
      .then(() => {
        dispatch(removeUser());
        dispatch(logoutSuccessful());
      })
      .catch((error) => {
        dispatch(logoutFailed(error.message));
      }
    );
  };
}
