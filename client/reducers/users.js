import * as actionTypes from '../actions/actionTypes';

function userReducers(state = {
  isAuthenticated: false,
  users: [],
  roles: []
}, action) {
  switch (action.type) {
    case actionTypes.LOGOUT_REQUEST:
    case actionTypes.SIGNUP_REQUEST:
    case actionTypes.LOGIN_REQUEST:
    case actionTypes.LOGOUT_FAILED:
    case actionTypes.SIGNUP_FAILED:
    case actionTypes.LOGIN_FAILED:
    case actionTypes.LOGOUT_SUCCESSFUL:
    case actionTypes.SIGNUP_SUCCESSFUL:
    case actionTypes.LOGIN_SUCCESSFUL:
      return Object.assign({}, state, {
        result: action.type
      });
    case actionTypes.REMOVE_USER:
      return {
        isAuthenticated: false,
        result: action.type
      };
    case actionTypes.ADD_USER:
      return Object.assign({}, state, {
        id: action.payload.user.id,
        email: action.payload.user.email_address,
        username: action.payload.user.username,
        firstname: action.payload.user.first_name,
        lastname: action.payload.user.last_name,
        result: action.type,
        isAuthenticated: true,
        role: action.payload.role,
      });
    case actionTypes.FETCH_USERS_REQUEST:
      return Object.assign({}, state, {
        updatingUsers: true,
        userUpdateSuccessful: false
      });
    case actionTypes.FETCH_USERS_SUCCESSFUL:
      return Object.assign({}, state, {
        updatingUsers: false,
        userUpdateSuccessful: true,
        users: action.payload
      });
    case actionTypes.FETCH_USERS_FAILED:
      return Object.assign({}, state, {
        updatingUsers: false,
        userUpdateSuccessful: false
      });
    case actionTypes.FETCH_ROLES_REQUEST:
      return Object.assign({}, state, {
        updatingRoles: true,
        roleUpdateSuccessful: false
      });
    case actionTypes.FETCH_ROLES_SUCCESSFUL:
      return Object.assign({}, state, {
        updatingRoles: false,
        roleUpdateSuccessful: true,
        roles: action.payload
      });
    case actionTypes.FETCH_ROLES_FAILED:
      return Object.assign({}, state, {
        updatingRoles: false,
        roleUpdateSuccessful: false
      });
    default:
      return state;
  }
}

export default userReducers;
