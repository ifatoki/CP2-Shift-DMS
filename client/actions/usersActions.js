import axios from 'axios';
import lodash from 'lodash';
import actionTypes from './actionTypes';
import Validator from '../../server/utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

/**
 * Deletes the current user and token
 * from localstorage and dispatchs and action.
 * @function removeUser
 *
 * @returns {Object} Action
 */
const removeUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  return {
    type: actionTypes.REMOVE_USER
  };
};

/**
 * Dispatches a SIGNUP_REQUEST action
 * @function requestSignup
 *
 * @param {Object} payload - Action Payload
 * @returns {Object} Action
 */
const requestSignup = payload => ({
  type: actionTypes.SIGNUP_REQUEST,
  payload
});

/**
 * Dispatches a SIGNUP_SUCCESSFUL action
 * @function signupSuccessful
 *
 * @returns {Object} Action
 */
const signupSuccessful = () => ({
  type: actionTypes.SIGNUP_SUCCESSFUL
});

/**
 * Dispatches a SIGNUP_FAILED action
 * @function signupFailed
 *
 * @param {string} payload - Error message
 * @returns {Object} Action
 */
const signupFailed = payload => ({
  type: actionTypes.SIGNUP_FAILED,
  payload
});

/**
 * Dispatches a LOGIN_REQUEST action
 * @function requestLogin
 *
 * @param {string} payload - Username of user
 * @returns {Object} Action
 */
const requestLogin = payload => ({
  type: actionTypes.LOGIN_REQUEST,
  payload
});

/**
 * Dispatches a LOGIN_SUCCESSFUL action
 * @function loginSuccessful
 *
 * @returns {Object} Action
 */
const loginSuccessful = () => ({
  type: actionTypes.LOGIN_SUCCESSFUL
});

/**
 * Dispatches a LOGIN_FAILED action
 * @function loginFailed
 *
 * @param {string} payload - Error message
 * @returns {Object} Action
 */
const loginFailed = payload => ({
  type: actionTypes.LOGIN_FAILED,
  payload
});

/**
 * Dispatches a LOGOUT_REQUEST action
 * @function logoutRequest
 *
 * @returns {Object} Action
 */
const logoutRequest = () => ({
  type: actionTypes.LOGOUT_REQUEST
});

/**
 * Dispatches a LOGOUT_SUCCESSFUL action
 * @function logoutSuccessful
 *
 * @returns {Object} Action
 */
const logoutSuccessful = () => ({
  type: actionTypes.LOGOUT_SUCCESSFUL
});

/**
 * Dispatches a FETCH_USERS_REQUEST action
 * @function fetchAllUsersRequest
 *
 * @returns {Object} Action
 */
const fetchAllUsersRequest = () => ({
  type: actionTypes.FETCH_USERS_REQUEST
});

/**
 * Dispatches a FETCH_USERS_SUCCESSFUL action
 * @function fetchAllUsersSuccessful
 *
 * @param {Object} payload - Action Payload
 * @returns {Object} Action
 */
const fetchAllUsersSuccessful = payload => ({
  type: actionTypes.FETCH_USERS_SUCCESSFUL,
  payload
});

/**
 * Dispatches a FETCH_USERS_FAILED action
 * @function fetchAllUsersFailed
 *
 * @param {string} payload - Error message
 * @returns {Object} Action
 */
const fetchAllUsersFailed = payload => ({
  type: actionTypes.FETCH_USERS_FAILED,
  payload
});

/**
 * Dispatches a FETCH_ROLES_REQUEST action
 * @function fetchAllRolesRequest
 *
 * @returns {Object} Action
 */
const fetchAllRolesRequest = () => ({
  type: actionTypes.FETCH_ROLES_REQUEST
});

/**
 * Dispatches a FETCH_ROLES_SUCCESSFUL action
 * @function fetchAllRolesSuccessful
 *
 * @param {Object} payload - Action Payload
 * @returns {Object} Action
 */
const fetchAllRolesSuccessful = payload => ({
  type: actionTypes.FETCH_ROLES_SUCCESSFUL,
  payload
});

/**
 * Dispatches a FETCH_ROLES_FAILED action
 * @function fetchAllRolesFailed
 *
 * @param {string} payload - Error message
 * @returns {Object} Action
 */
const fetchAllRolesFailed = payload => ({
  type: actionTypes.FETCH_ROLES_FAILED,
  payload
});

/**
 * Dispatches a USER_GET_REQUEST action
 * @function userGetRequest
 *
 * @returns {Object} Action
 */
const userGetRequest = () => ({
  type: actionTypes.USER_GET_REQUEST
});

/**
 * Dispatches a USER_GET_SUCCESSFUL action
 * @function userGetSuccessful
 *
 * @param {Object} payload - Action Payload
 * @return {object} Action
 */
const userGetSuccessful = payload => ({
  type: actionTypes.USER_GET_SUCCESSFUL,
  payload
});

/**
 * Dispatches a USER_GET_FAILED action
 * @function userGetFailed
 *
 * @param {string} payload - Error message
 * @return {object} Action
 */
const userGetFailed = payload => ({
  type: actionTypes.USER_GET_FAILED,
  payload
});

/**
 * Dispatches a USER_MODIFY_REQUEST action
 * @function userModifyRequest
 *
 * @return {object} Action
 */
const userModifyRequest = () => ({
  type: actionTypes.USER_MODIFY_REQUEST
});

/**
 * Dispatches a USER_MODIFY_SUCCESSFUL action
 * @function userModifySuccessful
 *
 * @param {Object} payload - Action Payload
 * @return {object} Action
 */
const userModifySuccessful = payload => ({
  type: actionTypes.USER_MODIFY_SUCCESSFUL,
  payload
});

/**
 * Dispatches a USER_MODIFY_FAILED action
 * @function userModifyFailed
 *
 * @param {string} payload - Error message
 * @return {object} Action
 */
const userModifyFailed = payload => ({
  type: actionTypes.USER_MODIFY_FAILED,
  payload
});

/**
 * Dispatches a USER_DELETE_REQUEST action
 * @function userDeleteRequest
 *
 * @return {object} Action
 */
const userDeleteRequest = () => ({
  type: actionTypes.USER_DELETE_REQUEST
});

/**
 * Dispatches a USER_DELETE_SUCCESSFUL action
 * @function userDeleteSuccessful
 *
 * @param {string} payload - Success Message
 * @return {object} Action
 */
const userDeleteSuccessful = payload => ({
  type: actionTypes.USER_DELETE_SUCCESSFUL,
  payload
});

/**
 * Dispatches a USER_DELETE_FAILED action
 * @function userDeleteFailed
 *
 * @param {string} payload - Error message
 * @return {object} Action
 */
const userDeleteFailed = payload => ({
  type: actionTypes.USER_DELETE_FAILED,
  payload
});

/**
 * Generate and return the error messages in HTML format
 * @function getErrorMessage
 *
 * @param {Object} errors - Object of Validation Errors
 * @returns {string} errorMessage
 */
const getErrorMessage = (errors) => {
  const errorMessage = lodash.reduce(errors, (result, error) =>
    `${error}<br/>${result}`
  , '');
  return errorMessage;
};

const usersActions = {
  setTokenToLocalStorage(user, token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify({
      id: user.id,
      username: user.username
    }));
    return usersActions.addUser(user, token);
  },

  /**
   * Dispatches actions associated with adding new user
   * @function addUser
   *
   * @param {Object} user - User to be added
   * @param {string} token - User token
   * @param {RequestCallback} callback - Request callback on completion
   * @returns {Object} Action
   */
  addUser(user, token, callback) {
    axios.defaults.headers.common.Authorization = `bearer ${token}`;
    if (Object.keys(user).length < 3) {
      axios.get(`/api/v1/users/${user.id}`)
      .then(response => (
        callback({
          type: actionTypes.ADD_USER,
          payload: response.data.user
        })));
    } else {
      return ({
        type: actionTypes.ADD_USER,
        payload: user
      });
    }
  },

  /**
   * Dispatches actions associated with signing user up
   * @function signUserUp
   *
   * @param {Object} userData - User data for signup
   * @returns {Object} Action
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
            dispatch(usersActions.setTokenToLocalStorage(
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
   * @param {Object} userData - User login data
   * @returns {Object} Action
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
              usersActions.setTokenToLocalStorage(
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
   * @returns {Object} Action
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
   * @returns {Object} Action
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
   * @returns {Object} Action
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
   * @param {number} userId - Id of user to be fetched
   * @returns {Object} Action
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
   * @param {number} userId - Id of user to be modified
   * @param {Object} userData - modification data for user
   * @returns {Object} Action
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
   * @param {number} userId - Id of user to be deleted
   * @returns {Object} Action
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
   * @returns {Object} Action
   */
  cancelUser() {
    return dispatch => dispatch({
      type: actionTypes.USER_CANCELLED,
    });
  }
};

export default usersActions;
