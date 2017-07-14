function userReducers(state = { isAuthenticated: false }, action) {
  switch (action.type) {
    case 'LOGOUT_REQUEST':
    case 'SIGNUP_REQUEST':
    case 'LOGIN_REQUEST':
    case 'LOGOUT_FAILED':
    case 'SIGNUP_FAILED':
    case 'LOGIN_FAILED':
    case 'LOGOUT_SUCCESSFUL':
    case 'SIGNUP_SUCCESSFUL':
    case 'LOGIN_SUCCESSFUL':
      return Object.assign({}, state, {
        result: action.type
      });
    case 'REMOVE_USER':
      return {
        isAuthenticated: false,
        result: action.type
      };
    case 'ADD_USER':
      return Object.assign({}, state, {
        id: action.payload.user.id,
        email: action.payload.user.email_address,
        username: action.payload.user.username,
        firstname: action.payload.user.first_name,
        lastname: action.payload.user.last_name,
        result: action.type,
        isAuthenticated: true
      });
    default:
      return state;
  }
}

export default userReducers;
