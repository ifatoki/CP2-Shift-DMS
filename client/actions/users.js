import axios from 'axios';
import store from '../client';

const ADD_USER = 'ADD_USER';
const REMOVE_USER = 'REMOVE_USER';
const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
const SIGNUP_SUCCESSFUL = 'SIGNUP_SUCCESSFUL';
const SIGNUP_FAILED = 'SIGNUP_FAILED';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
const LOGOUT_SUCCESSFUL = 'LOGOUT_SUCCESSFUL';
const LOGOUT_FAILED = 'LOGOUT_FAILED';

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
        type: ADD_USER,
        payload: {
          user: response.data.user,
          role: response.data.role
        }
      })));
  } else {
    store.dispatch({
      type: ADD_USER,
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
    type: REMOVE_USER
  };
};

const requestSignup = username => ({
  type: SIGNUP_REQUEST,
  payload: username
});

const signupSuccessful = () => ({
  type: SIGNUP_SUCCESSFUL
});

const signupFailed = message => ({
  type: SIGNUP_FAILED,
  payload: message
});

const requestLogin = username => ({
  type: LOGIN_REQUEST,
  payload: username
});

const loginSuccessful = () => ({
  type: LOGIN_SUCCESSFUL
});

const loginFailed = message => ({
  type: LOGIN_FAILED,
  payload: message
});

const logoutRequest = () => ({
  type: LOGOUT_REQUEST
});

const logoutSuccessful = () => ({
  type: LOGOUT_SUCCESSFUL
});

const logoutFailed = message => ({
  type: LOGOUT_FAILED,
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
