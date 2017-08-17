import axios from 'axios';
import _ from 'lodash';
import ActionTypes from './ActionTypes';
import Validator from '../../server/utils/Validator';

const config = {
  headers: { 'Content-Type': 'application/json' }
};

const removeUser = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  return {
    type: ActionTypes.REMOVE_USER
  };
};

const requestSignup = payload => ({
  type: ActionTypes.SIGNUP_REQUEST,
  payload
});

const signupSuccessful = () => ({
  type: ActionTypes.SIGNUP_SUCCESSFUL
});

const signupFailed = payload => ({
  type: ActionTypes.SIGNUP_FAILED,
  payload
});

const requestLogin = payload => ({
  type: ActionTypes.LOGIN_REQUEST,
  payload
});

const loginSuccessful = () => ({
  type: ActionTypes.LOGIN_SUCCESSFUL
});

const loginFailed = payload => ({
  type: ActionTypes.LOGIN_FAILED,
  payload
});

const logoutRequest = () => ({
  type: ActionTypes.LOGOUT_REQUEST
});

const logoutSuccessful = () => ({
  type: ActionTypes.LOGOUT_SUCCESSFUL
});

const logoutFailed = payload => ({
  type: ActionTypes.LOGOUT_FAILED,
  payload
});

const fetchAllUsersRequest = () => ({
  type: ActionTypes.FETCH_USERS_REQUEST
});

const fetchAllUsersSuccessful = payload => ({
  type: ActionTypes.FETCH_USERS_SUCCESSFUL,
  payload
});

const fetchAllUsersFailed = payload => ({
  type: ActionTypes.FETCH_USERS_FAILED,
  payload
});

const fetchAllRolesRequest = () => ({
  type: ActionTypes.FETCH_ROLES_REQUEST
});

const fetchAllRolesSuccessful = payload => ({
  type: ActionTypes.FETCH_ROLES_SUCCESSFUL,
  payload
});

const fetchAllRolesFailed = payload => ({
  type: ActionTypes.FETCH_ROLES_FAILED,
  payload
});

const userGetRequest = () => ({
  type: ActionTypes.USER_GET_REQUEST
});

const userGetSuccessful = payload => ({
  type: ActionTypes.USER_GET_SUCCESSFUL,
  payload
});

const userGetFailed = payload => ({
  type: ActionTypes.USER_GET_FAILED,
  payload
});

const userModifyRequest = () => ({
  type: ActionTypes.USER_MODIFY_REQUEST
});

const userModifySuccessful = payload => ({
  type: ActionTypes.USER_MODIFY_SUCCESSFUL,
  payload
});

const userModifyFailed = payload => ({
  type: ActionTypes.USER_MODIFY_FAILED,
  payload
});

const userDeleteRequest = () => ({
  type: ActionTypes.USER_DELETE_REQUEST
});

const userDeleteSuccessful = payload => ({
  type: ActionTypes.USER_DELETE_SUCCESSFUL,
  payload
});

const userDeleteFailed = payload => ({
  type: ActionTypes.USER_DELETE_FAILED,
  payload
});

const getErrorMessage = (errors) => {
  const errorMessage = _.reduce(errors, (result, error) => {
    return `${error}<br/>${result}`;
  }, '');
  return errorMessage;
};

const UsersActions = {
  setTokenToLocalStorage(user, token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
    return UsersActions.addUser(user, token);
  },

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

  cancelUser() {
    return dispatch => dispatch({
      type: ActionTypes.USER_CANCELLED,
    });
  }
};

export default UsersActions;
