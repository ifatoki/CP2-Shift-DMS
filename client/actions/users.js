import axios from 'axios';
import store from '../client';
import * as actionTypes from './actionTypes';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

export function addUser(user, token) {
  axios.defaults.headers.common.Authorization = `bearer ${token}`;
  if (Object.keys(user).length < 3) {
    axios.get(`/api/v1/users/${user.id}`)
    .then(response => (
      store.dispatch({
        type: actionTypes.ADD_USER,
        payload: response.data
      })));
  } else {
    store.dispatch({
      type: actionTypes.ADD_USER,
      payload: user
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

const requestSignup = payload => ({
  type: actionTypes.SIGNUP_REQUEST,
  payload
});

const signupSuccessful = () => ({
  type: actionTypes.SIGNUP_SUCCESSFUL
});

const signupFailed = payload => ({
  type: actionTypes.SIGNUP_FAILED,
  payload
});

const requestLogin = payload => ({
  type: actionTypes.LOGIN_REQUEST,
  payload
});

const loginSuccessful = () => ({
  type: actionTypes.LOGIN_SUCCESSFUL
});

const loginFailed = payload => ({
  type: actionTypes.LOGIN_FAILED,
  payload
});

const logoutRequest = () => ({
  type: actionTypes.LOGOUT_REQUEST
});

const logoutSuccessful = () => ({
  type: actionTypes.LOGOUT_SUCCESSFUL
});

const logoutFailed = payload => ({
  type: actionTypes.LOGOUT_FAILED,
  payload
});

const fetchAllUsersRequest = () => ({
  type: actionTypes.FETCH_USERS_REQUEST
});

const fetchAllUsersSuccessful = payload => ({
  type: actionTypes.FETCH_USERS_SUCCESSFUL,
  payload
});

const fetchAllUsersFailed = payload => ({
  type: actionTypes.FETCH_USERS_FAILED,
  payload
});

const fetchAllRolesRequest = () => ({
  type: actionTypes.FETCH_ROLES_REQUEST
});

const fetchAllRolesSuccessful = payload => ({
  type: actionTypes.FETCH_ROLES_SUCCESSFUL,
  payload
});

const fetchAllRolesFailed = payload => ({
  type: actionTypes.FETCH_ROLES_FAILED,
  payload
});

const userGetRequest = () => ({
  type: actionTypes.USER_GET_REQUEST
});

const userGetSuccessful = payload => ({
  type: actionTypes.USER_GET_SUCCESSFUL,
  payload
});

const userGetFailed = payload => ({
  type: actionTypes.USER_GET_FAILED,
  payload
});

const userModifyRequest = () => ({
  type: actionTypes.USER_MODIFY_REQUEST
});

const userModifySuccessful = payload => ({
  type: actionTypes.USER_MODIFY_SUCCESSFUL,
  payload
});

const userModifyFailed = payload => ({
  type: actionTypes.USER_MODIFY_FAILED,
  payload
});

function setTokenToLocalStorage(user, token) {
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(user));
  addUser(user, token);
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
          setTokenToLocalStorage(
            response.data.payload.user,
            response.data.payload.token
          );
          dispatch(signupSuccessful());
        })
        .catch((error) => {
          dispatch(signupFailed(error.response.data.message));
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
        dispatch(loginFailed(error.response.data.message));
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
        dispatch(logoutFailed(error.response.data.message));
      }
    );
  };
}

export function fetchAllUsers() {
  return (dispatch) => {
    dispatch(fetchAllUsersRequest());
    return axios
      .get('/api/v1/users/', config)
      .then((users) => {
        dispatch(fetchAllUsersSuccessful(users.data));
      })
      .catch((error) => {
        dispatch(fetchAllUsersFailed(error.response.data.message));
      });
  };
}

export function fetchAllRoles() {
  return (dispatch) => {
    dispatch(fetchAllRolesRequest());
    return axios
      .get('/api/v1/roles/', config)
      .then((roles) => {
        dispatch(fetchAllRolesSuccessful(roles.data));
      })
      .catch((error) => {
        dispatch(fetchAllRolesFailed(error.response.data.message));
      });
  };
}

export function getUser(userId) {
  return (dispatch) => {
    dispatch(userGetRequest());
    return axios
      .get(`api/v1/users/${userId}`)
      .then((response) => {
        dispatch(userGetSuccessful(response.data));
      })
      .catch((error) => {
        dispatch(userGetFailed(error.response.data.message));
      });
  };
}

export function modifyUser(userId, userData) {
  return (dispatch) => {
    dispatch(userModifyRequest());
    return axios
      .put(`api/v1/users/${userId}`, userData, config)
      .then((response) => {
        dispatch(userModifySuccessful(response.data));
      })
      .catch((error) => {
        dispatch(userModifyFailed(error.response.data.message));
      });
  };
}

export function cancelUser() {
  return dispatch => dispatch({
    type: actionTypes.USER_CANCELLED,
  });
}
