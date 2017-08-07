import * as actionTypes from '../actions/actionTypes';

function userReducers(state = {
  isAuthenticated: false,
  users: [],
  roles: [],
  currentUser: {},
  currentUserUpdated: false,
  currentUserModifying: false,
  currentUserModified: false
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
      id: action.payload.id,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      role: action.payload.role,
      result: action.type,
      isAuthenticated: true,
      currentUserUpdated: false
    });
  case actionTypes.FETCH_USERS_REQUEST:
    return Object.assign({}, state, {
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      usersUpdating: true
    });
  case actionTypes.FETCH_USERS_SUCCESSFUL:
    return Object.assign({}, state, {
      users: action.payload,
      usersUpdated: true,
      usersUpdating: false,
    });
  case actionTypes.FETCH_USERS_FAILED:
    return Object.assign({}, state, {
      usersUpdated: false,
      usersUpdating: false
    });
  case actionTypes.USER_MODIFY_REQUEST:
    return Object.assign({}, state, {
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModifying: true
    });
  case actionTypes.USER_MODIFY_SUCCESSFUL:
    return Object.assign({}, state, {
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      currentUser: action.payload,
      currentUserModified: true,
      currentUserUpdated: true,
      currentUserModifying: false,
    });
  case actionTypes.USER_MODIFY_FAILED:
    return Object.assign({}, state, {
      currentUserModified: false,
      currentUserModifying: false,
    });
  case actionTypes.USER_GET_REQUEST:
    return Object.assign({}, state, {
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      currentUserUpdating: true,
    });
  case actionTypes.USER_GET_SUCCESSFUL:
    return Object.assign({}, state, {
      currentUser: action.payload,
      currentUserUpdated: true,
      currentUserUpdating: false,
    });
  case actionTypes.USER_GET_FAILED:
    return Object.assign({}, state, {
      currentUserUpdated: false,
      currentUserUpdating: false,
    });
  case actionTypes.FETCH_ROLES_REQUEST:
    return Object.assign({}, state, {
      rolesUpdated: false,
      usersUpdated: false,
      updatingRoles: true,
    });
  case actionTypes.FETCH_ROLES_SUCCESSFUL:
    return Object.assign({}, state, {
      rolesUpdated: true,
      roles: action.payload
    });
  case actionTypes.FETCH_ROLES_FAILED:
    return Object.assign({}, state, {
      rolesUpdated: false,
      updatingRoles: false,
    });
  case actionTypes.USER_CANCELLED:
    return Object.assign({}, state, {
      currentUserUpdated: false,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false
    });
  default:
    return state;
  }
}

export default userReducers;
