import ActionTypes from '../actions/ActionTypes';

const initialState = {
  isAuthenticated: false,
  users: [],
  roles: [],
  currentUser: {},
  currentUserUpdated: false,
  userDeleted: false,
  userDeleting: false,
  currentUserModifying: false,
  currentUserModified: false,
  currentUserErrorMessage: ''
};

function users(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.LOGOUT_REQUEST:
  case ActionTypes.SIGNUP_REQUEST:
  case ActionTypes.LOGIN_REQUEST:
  case ActionTypes.LOGOUT_SUCCESSFUL:
  case ActionTypes.SIGNUP_SUCCESSFUL:
  case ActionTypes.LOGIN_SUCCESSFUL:
    return {
      ...state,
      currentUserErrorMessage: '',
      result: action.type
    };
  case ActionTypes.LOGOUT_FAILED:
  case ActionTypes.SIGNUP_FAILED:
  case ActionTypes.LOGIN_FAILED:
    return {
      ...state,
      currentUserErrorMessage: action.payload,
      result: action.type
    };
  case ActionTypes.REMOVE_USER:
    return {
      ...state,
      ...state,
      id: null,
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      role: '',
      result: action.type,
      isAuthenticated: false,
      currentUserUpdated: false,
      currentUserErrorMessage: ''
    };
  case ActionTypes.ADD_USER:
    return {
      ...state,
      id: action.payload.id,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      roleId: action.payload.roleId,
      role: action.payload.role,
      result: action.type,
      isAuthenticated: true,
      currentUserUpdated: false,
      currentUserErrorMessage: ''
    };
  case ActionTypes.FETCH_USERS_REQUEST:
    return {
      ...state,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      usersUpdating: true,
      currentUserErrorMessage: ''
    };
  case ActionTypes.FETCH_USERS_SUCCESSFUL:
    return {
      ...state,
      users: action.payload,
      usersUpdated: true,
      usersUpdating: false,
    };
  case ActionTypes.FETCH_USERS_FAILED:
    return {
      ...state,
      usersUpdated: false,
      usersUpdating: false,
      currentUserErrorMessage: action.payload
    };
  case ActionTypes.USER_MODIFY_REQUEST:
    return {
      ...state,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      userDeleted: false,
      currentUserModifying: true,
      currentUserErrorMessage: ''
    };
  case ActionTypes.USER_MODIFY_SUCCESSFUL:
    return {
      ...state,
      email: action.payload.email,
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      currentUser: action.payload,
      currentUserErrorMessage: '',
      currentUserModified: true,
      currentUserUpdated: true,
      currentUserModifying: false,
    };
  case ActionTypes.USER_MODIFY_FAILED:
    return {
      ...state,
      currentUserModified: false,
      currentUserModifying: false,
      currentUserErrorMessage: action.payload
    };
  case ActionTypes.USER_GET_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      currentUserUpdating: true,
      currentUserErrorMessage: ''
    };
  case ActionTypes.USER_GET_SUCCESSFUL:
    return {
      ...state,
      currentUser: action.payload,
      currentUserUpdated: true,
      currentUserUpdating: false,
    };
  case ActionTypes.USER_GET_FAILED:
    return {
      ...state,
      currentUserUpdated: false,
      currentUserUpdating: false,
      currentUserErrorMessage: action.payload
    };
  case ActionTypes.USER_DELETE_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      currentUserUpdated: false,
      currentUserModified: false,
      userDeleted: false,
      userDeleting: true,
      currentUserErrorMessage: ''
    };
  case ActionTypes.USER_DELETE_SUCCESSFUL:
    return {
      ...state,
      userDeleted: true,
      userDeleting: false,
    };
  case ActionTypes.USER_DELETE_FAILED:
    return {
      ...state,
      userDeleted: false,
      userDeleting: false,
      currentUserErrorMessage: action.payload
    };
  case ActionTypes.FETCH_ROLES_REQUEST:
    return {
      ...state,
      rolesUpdated: false,
      usersUpdated: false,
      userDeleted: false,
      updatingRoles: true,
      currentUserErrorMessage: ''
    };
  case ActionTypes.FETCH_ROLES_SUCCESSFUL:
    return {
      ...state,
      rolesUpdated: true,
      roles: action.payload
    };
  case ActionTypes.FETCH_ROLES_FAILED:
    return {
      ...state,
      rolesUpdated: false,
      updatingRoles: false,
      currentUserErrorMessage: action.payload
    };
  case ActionTypes.USER_CANCELLED:
    return {
      ...state,
      currentUserUpdated: false,
      currentUserModified: false,
      rolesUpdated: false,
      usersUpdated: false,
      userDeleted: false,
      currentUserErrorMessage: ''
    };
  default:
    return state;
  }
}

export default users;
