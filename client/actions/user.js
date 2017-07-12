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

export function addUser(user, token) {
  console.log('token', token);
  console.log(store);
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
  if (Object.keys(user).length < 3) {
    axios.get(`/api/users/${user.id}`)
    .then(response => (
      store.dispatch({
        type: ADD_USER,
        payload: {
          user: response.data
        }
      })));
  }
  return {
    type: ADD_USER,
    payload: user
  };
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

const signupSuccessful = payload => ({
  type: SIGNUP_SUCCESSFUL,
  payload
});

const signupFailed = message => ({
  type: SIGNUP_FAILED,
  payload: message
});

const requestLogin = username => ({
  type: LOGIN_REQUEST,
  payload: username
});

const loginSuccessful = payload => ({
  type: LOGIN_SUCCESSFUL,
  payload
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

function setTokenToLocalStorage(user, token) {
  console.log('token is here', token);
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', user);
  addUser(user, token);
}

export function
  signUserUp(userDetails) {
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
        .post('/api/users', userdata, config)
        .then((response) => {
          setTokenToLocalStorage(
            response.data.payload.user,
            response.data.payload.token
          );
          dispatch(signupSuccessful(response.data.payload.user));
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
      .post('/api/users/login', userdata, config)
      .then((response) => {
        console.log(response);
        setTokenToLocalStorage(
          response.data.payload.user,
          response.data.payload.token
        );
        dispatch(loginSuccessful(response.data.payload.user));
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
      .post('/api/users/logout', config)
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
