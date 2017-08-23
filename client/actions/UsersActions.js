import axios from 'axios';
import _ from 'lodash';
import ActionTypes from './ActionTypes';
import Validator from '../../server/utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

/**
 * Deletes the current user and token
 * from localstorage and dispatchs and action.
 * @function removeUser
 *
 * @returns {object} Action
 */
const removeUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  return {
    type: ActionTypes.REMOVE_USER
  };
};

/**
 * @function requestSignup
 *
 * @param {any} payload
 * @returns {object} Action
 */
const requestSignup = payload => ({
  type: ActionTypes.SIGNUP_REQUEST,
  payload
});

/**
 * @function signupSuccessful
 *
 * @returns {object} Action
 */
const signupSuccessful = () => ({
  type: ActionTypes.SIGNUP_SUCCESSFUL
});

/**
 * @function signupFailed
 *
 * @param {any} payload
 * @returns {object} Action
 */
const signupFailed = payload => ({
  type: ActionTypes.SIGNUP_FAILED,
  payload
});

/**
 * @function requestLogin
 *
 * @param {any} payload
 * @returns {object} Action
 */
const requestLogin = payload => ({
  type: ActionTypes.LOGIN_REQUEST,
  payload
});

/**
 * @function loginSuccessful
 *
 * @returns {object} Action
 */
const loginSuccessful = () => ({
  type: ActionTypes.LOGIN_SUCCESSFUL
});

/**
 * @function loginFailed
 *
 * @param {any} payload
 * @returns {object} Action
 */
const loginFailed = payload => ({
  type: ActionTypes.LOGIN_FAILED,
  payload
});

/**
 * @function logoutRequest
 *
 * @returns {object} Action
 */
const logoutRequest = () => ({
  type: ActionTypes.LOGOUT_REQUEST
});

/**
 * @function logoutSuccessful
 *
 * @returns {object} Action
 */
const logoutSuccessful = () => ({
  type: ActionTypes.LOGOUT_SUCCESSFUL
});

/**
 * @function fetchAllUsersRequest
 *
 * @returns {object} Action
 */
const fetchAllUsersRequest = () => ({
  type: ActionTypes.FETCH_USERS_REQUEST
});

/**
 * @function fetchAllUsersSuccessful
 *
 * @param {any} payload
 * @returns {object} Action
 */
const fetchAllUsersSuccessful = payload => ({
  type: ActionTypes.FETCH_USERS_SUCCESSFUL,
  payload
});

/**
 * @function fetchAllUsersFailed
 *
 * @param {any} payload
 * @returns {object} Action
 */
const fetchAllUsersFailed = payload => ({
  type: ActionTypes.FETCH_USERS_FAILED,
  payload
});

/**
 * @function fetchAllRolesRequest
 *
 * @returns {object} Action
 */
const fetchAllRolesRequest = () => ({
  type: ActionTypes.FETCH_ROLES_REQUEST
});

/**
 * @function fetchAllRolesSuccessful
 *
 * @param {any} payload
 * @returns {object} Action
 */
const fetchAllRolesSuccessful = payload => ({
  type: ActionTypes.FETCH_ROLES_SUCCESSFUL,
  payload
});

/**
 * @function fetchAllRolesFailed
 *
 * @param {any} payload
 * @returns {object} Action
 */
const fetchAllRolesFailed = payload => ({
  type: ActionTypes.FETCH_ROLES_FAILED,
  payload
});

/**
 * @function userGetRequest
 *
 * @returns {object} Action
 */
const userGetRequest = () => ({
  type: ActionTypes.USER_GET_REQUEST
});

/**
 * @function userGetSuccessful
 *
 * @param {any} payload
 * @return {object} Action
 */
const userGetSuccessful = payload => ({
  type: ActionTypes.USER_GET_SUCCESSFUL,
  payload
});

/**
 * @function userGetFailed
 *
 * @param {any} payload
 * @return {object} Action
 */
const userGetFailed = payload => ({
  type: ActionTypes.USER_GET_FAILED,
  payload
});

/**
 * @function userModifyRequest
 *
 * @return {object} Action
 */
const userModifyRequest = () => ({
  type: ActionTypes.USER_MODIFY_REQUEST
});

/**
 * @function userModifySuccessful
 *
 * @param {any} payload
 * @return {object} Action
 */
const userModifySuccessful = payload => ({
  type: ActionTypes.USER_MODIFY_SUCCESSFUL,
  payload
});

/**
 * @function userModifyFailed
 *
 * @param {any} payload
 * @return {object} Action
 */
const userModifyFailed = payload => ({
  type: ActionTypes.USER_MODIFY_FAILED,
  payload
});

/**
 * @function userDeleteRequest
 *
 * @return {object} Action
 */
const userDeleteRequest = () => ({
  type: ActionTypes.USER_DELETE_REQUEST
});

/**
 * @function userDeleteSuccessful
 *
 * @param {any} payload
 * @return {object} Action
 */
const userDeleteSuccessful = payload => ({
  type: ActionTypes.USER_DELETE_SUCCESSFUL,
  payload
});

/**
 * @function userDeleteFailed
 *
 * @param {any} payload
 * @return {object} Action
 */
const userDeleteFailed = payload => ({
  type: ActionTypes.USER_DELETE_FAILED,
  payload
});

/**
 * @function getErrorMessage
 *
 * @param {any} errors
 * @returns {string} errorMessage
 */
const getErrorMessage = (errors) => {
  const errorMessage = _.reduce(errors, (result, error) =>
    `${error}<br/>${result}`
  , '');
  return errorMessage;
};

const UsersActions = {
  setTokenToLocalStorage(user, token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify({
      id: user.id,
      username: user.username
    }));
    return UsersActions.addUser(user, token);
  },

  /**
   * Dispatches actions associated with adding new user
   * @function addUser
   *
   * @param {any} user
   * @param {any} token
   * @param {any} callback
   * @returns {object} Action
   */
  addUser(user, token, callback) {
    axios.defaults.headers.common.Authorization = `bearer ${token}`;
    if (Object.keys(user).length < 3) {
      axios.get(`/api/v1/users/${user.id}`)
      .then(response => (
        callback({
          type: ActionTypes.ADD_USER,
          payload: response.data.user
        })));
    } else {
      return ({
        type: ActionTypes.ADD_USER,
        payload: user
      });
    }
  },

  /**
   * Dispatches actions associated with signing user up
   * @function signUserUp
   *
   * @param {any} userData
   * @returns {object} Action
   */
  signUserUp({
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
            dispatch(UsersActions.setTokenToLocalStorage(
              response.data.user,
              response.data.token
            ));
            dispatch(signupSuccessful());
          })
          .catch((error) => {
            dispatch(signupFailed(error.response.data.message));
          });
      }
      dispatch(signupFailed(getErrorMessage(validation.errors)));
    };
  },

  /**
   * Dispatches actions associated with signing user in
   * @function logUserIn
   *
   * @param {any} userData
   * @returns {object} Action
   */
  logUserIn({ username, password }) {
    const userdata = { username, password };
    const validation = Validator.validateLogin(userdata);

    return (dispatch) => {
      dispatch(requestLogin(userdata.username));
      if (validation.isValid) {
        return axios
          .post('api/v1/users/login', userdata, config)
          .then((response) => {
            dispatch(
              UsersActions.setTokenToLocalStorage(
                response.data.user,
                response.data.token
              ));
            dispatch(loginSuccessful());
          })
          .catch((error) => {
            dispatch(loginFailed(error.response.data.message));
          });
      }
      dispatch(loginFailed(getErrorMessage(validation.errors)));
    };
  },

  /**
   * Dispatches actions associated with signing user out
   * @function logUserOut
   *
   * @returns {object} Action
   */
  logUserOut() {
    return (dispatch) => {
      dispatch(logoutRequest());
      return axios
        .post('/api/v1/users/logout', config)
        .then(() => {
          dispatch(removeUser());
          dispatch(logoutSuccessful());
        });
    };
  },

  /**
   * Dispatches actions associated with fetching all users
   * @function fetchAllUsers
   *
   * @returns {object} Action
   */
  fetchAllUsers() {
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
  },

  /**
   * Dispatches actions associated with fetching all roles.
   * @function fetchAllRoles
   *
   * @returns {object} Action
   */
  fetchAllRoles() {
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
  },

  /**
   * Dispatches actions associated with getting a user
   * @function getUser
   *
   * @param {any} userId
   * @returns {object} Action
   */
  getUser(userId) {
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
  },

  /**
   * Dispatches actions associated with modifying user data
   * @function modifyUser
   *
   * @param {any} userId
   * @param {any} userData
   * @returns {object} Action
   */
  modifyUser(userId, userData) {
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
  },

  /**
   * Dispatches actions associated with creating a new user
   * @function deleteUser
   *
   * @param {any} userId
   * @returns {object} Action
   */
  deleteUser(userId) {
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
  },

  /**
   * Dispatches a USER_CANCELLED action
   * @function cancelUser
   *
   * @returns {object} Action
   */
  cancelUser() {
    return dispatch => dispatch({
      type: ActionTypes.USER_CANCELLED,
    });
  }
};

export default UsersActions;
