import * as actionTypes from '../actions/actionTypes';

function userReducers(state = {
  isAuthenticated: false,
  users: [],
  roles: [],
  currentUser: {},
  currentUserUpdated: false
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
      usersUpdating: true,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
    });
  case actionTypes.FETCH_USERS_SUCCESSFUL:
    return Object.assign({}, state, {
      usersUpdating: false,
      usersUpdated: true,
      users: action.payload
    });
  case actionTypes.FETCH_USERS_FAILED:
    return Object.assign({}, state, {
      usersUpdating: false,
      usersUpdated: false
    });
  case actionTypes.USER_MODIFY_REQUEST:
    return Object.assign({}, state, {
      currentUserModifying: true,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false
    });
  case actionTypes.USER_MODIFY_SUCCESSFUL:
    return Object.assign({}, state, {
      currentUserModifying: false,
      currentUserModified: true,
      currentUserUpdated: true,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      currentUser: action.payload
    });
  case actionTypes.USER_MODIFY_FAILED:
    return Object.assign({}, state, {
      currentUserModifying: false,
      currentUserModified: false,
    });
  case actionTypes.USER_GET_REQUEST:
    return Object.assign({}, state, {
      currentUserUpdating: true,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
    });
  case actionTypes.USER_GET_SUCCESSFUL:
    return Object.assign({}, state, {
      currentUserUpdating: false,
      currentUserUpdated: true,
      currentUser: action.payload
    });
  case actionTypes.USER_GET_FAILED:
    return Object.assign({}, state, {
      currentUserUpdating: false,
      currentUserUpdated: false
    });
  case actionTypes.FETCH_ROLES_REQUEST:
    return Object.assign({}, state, {
      updatingRoles: true,
      rolesUpdated: false,
      usersUpdated: false
    });
  case actionTypes.FETCH_ROLES_SUCCESSFUL:
    return Object.assign({}, state, {
      updatingRoles: false,
      rolesUpdated: true,
      roles: action.payload
    });
  case actionTypes.FETCH_ROLES_FAILED:
    return Object.assign({}, state, {
      updatingRoles: false,
      rolesUpdated: false
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
