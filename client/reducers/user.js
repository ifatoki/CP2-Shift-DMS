function userReducers(state = { isAuthenticated: false }, action) {
  switch (action.type) {
    case 'LOGOUT_REQUEST':
    case 'LOGOUT_FAILED':
      return Object.assign({}, state, {
        result: action.type
      });
    case 'SIGNUP_REQUEST':
    case 'LOGIN_REQUEST':
    case 'SIGNUP_FAILED':
    case 'LOGIN_FAILED':
    case 'LOGOUT_SUCCESSFUL':
      return {
        isAuthenticated: false,
        result: action.type
      };
    case 'SIGNUP_SUCCESSFUL':
    case 'LOGIN_SUCCESSFUL':
      return Object.assign({}, state, {
        isAuthenticated: true,
        result: action.type,
        user: action.payload
      });
    case 'ADD_USER':
      return Object.assign({}, state, {
        user: action.payload.user,
        result: action.type,
        isAuthenticated: true
      });
    case 'REMOVE_USER':
      return Object.assign({}, state, {
        isAuthenticated: false,
        result: action.type,
        user: null
      });
    default:
      return state;
  }
}

export default userReducers;
