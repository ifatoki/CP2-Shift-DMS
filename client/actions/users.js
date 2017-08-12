import axios from 'axios';
import _ from 'lodash';
import store from '../client';
import * as actionTypes from './actionTypes';
import Validator from '../utils/Validator';

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
        payload: response.data.user
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

const userDeleteRequest = () => ({
  type: actionTypes.USER_DELETE_REQUEST
});

const userDeleteSuccessful = payload => ({
  type: actionTypes.USER_DELETE_SUCCESSFUL,
  payload
});

const userDeleteFailed = payload => ({
  type: actionTypes.USER_DELETE_FAILED,
  payload
});

function setTokenToLocalStorage(user, token) {
  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(user));
  addUser(user, token);
}

const getErrorMessage = (errors) => {
  const errorMessage = _.reduce(errors, (result, error) => {
    return `${error}<br/>${result}`;
  }, '');
  return errorMessage;
};

export function signUserUp({
  firstname, lastname, username, email, password, roleId, confirmPassword
}) {
  const userdata = {
    firstname, lastname, username, email, password, roleId, confirmPassword
  };
  const validation = Validator.validateSignUp(userdata);

  return (dispatch) => {
    dispatch(requestSignup(userdata.username));
    if (validation.isValid) {
      return axios
        .post('/api/v1/users', userdata, config)
        .then((response) => {
          setTokenToLocalStorage(
            response.data.user,
            response.data.token
          );
          dispatch(signupSuccessful());
        })
        .catch((error) => {
          dispatch(signupFailed(error.response.data.message));
        });
    }
    dispatch(signupFailed(getErrorMessage(validation.errors)));
  };
}

export function logUserIn({ username, password }) {
  const userdata = { username, password };
  const validation = Validator.validateLogin(userdata);

  return (dispatch) => {
    dispatch(requestLogin(userdata.username));
    if (validation.isValid) {
      return axios
        .post('/api/v1/users/login', userdata, config)
        .then((response) => {
          setTokenToLocalStorage(
            response.data.user,
            response.data.token
          );
          dispatch(loginSuccessful());
        })
        .catch((error) => {
          dispatch(loginFailed(error.response.data.message));
        });
    }
    dispatch(loginFailed(getErrorMessage(validation.errors)));
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
        dispatch(fetchAllUsersSuccessful(users.data.users));
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
        dispatch(fetchAllRolesSuccessful(roles.data.roles));
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
        dispatch(userGetSuccessful(response.data.user));
      })
      .catch((error) => {
        dispatch(userGetFailed(error.response.data.message));
      });
  };
}

export function modifyUser(userId, userData) {
  const validation = Validator.validateUserEdit(userData);

  return (dispatch) => {
    dispatch(userModifyRequest());
    if (validation.isValid) {
      return axios
        .put(`api/v1/users/${userId}`, userData, config)
        .then((response) => {
          dispatch(userModifySuccessful(response.data.user));
        })
        .catch((error) => {
          dispatch(userModifyFailed(error.response.data.message));
        });
    }
    dispatch(userModifyFailed(getErrorMessage(validation.errors)));
  };
}

export function deleteUser(userId) {
  return (dispatch) => {
    dispatch(userDeleteRequest());
    return axios
      .delete(`api/v1/users/${userId}`, config)
      .then((response) => {
        dispatch(userDeleteSuccessful(response.data.message));
      })
      .catch((error) => {
        dispatch(userDeleteFailed(error.response.data.message));
      });
  };
}

export function cancelUser() {
  return dispatch => dispatch({
    type: actionTypes.USER_CANCELLED,
  });
}
