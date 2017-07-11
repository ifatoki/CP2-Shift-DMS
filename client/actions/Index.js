import request from 'superagent';

const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
const SIGNUP_SUCCESSFUL = 'SIGNUP_SUCCESSFUL';
const SIGNUP_FAILED = 'SIGNUP_FAILED';
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
const LOGOUT_SUCCESSFUL = 'LOGOUT_SUCCESSFUL';
const LOGOUT_FAILED = 'LOGOUT_FAILED';

const requestSignup = username => (
  {
    type: SIGNUP_REQUEST,
    payload: username
  }
);

const signupSuccessful = payload => (
  {
    type: SIGNUP_SUCCESSFUL,
    payload
  }
);

const signupFailed = message => (
  {
    type: SIGNUP_FAILED,
    payload: message
  }
);

const requestLogin = username => (
  {
    type: LOGIN_REQUEST,
    payload: username
  }
);

const loginSuccessful = payload => (
  {
    type: LOGIN_SUCCESSFUL,
    payload
  }
);

const loginFailed = message => (
  {
    type: LOGIN_FAILED,
    payload: message
  }
);

const logoutRequest = () => (
  {
    type: LOGOUT_REQUEST
  }
);

const logoutSuccessful = () => (
  {
    type: LOGOUT_SUCCESSFUL
  }
);

const logoutFailed = message => (
  {
    type: LOGOUT_FAILED,
    payload: message
  }
);

function setTokenToLocalStorage(token) {
  window.localStorage.setItem('token', token);
}

export function
  signUserUp(userDetails) {
  const userdata = {
    firstname: userDetails.firstname,
    lastname: userDetails.lastname,
    username: userDetails.username,
    email: userDetails.email,
    password: userDetails.password,
    roleId: userDetails.roleId
  };
  return (dispatch) => {
    if (userDetails.password !== userDetails.confirmPassword) {
      dispatch(signupFailed('password mismatch'));
    } else {
      dispatch(requestSignup(userdata.username));
      return request
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(userdata)
        .end((error, response) => {
          if (!error) {
            setTokenToLocalStorage(response.body.payload.token);
            dispatch(signupSuccessful(response.body.payload));
          } else {
            dispatch(signupFailed(response.message));
          }
        });
    }
  };
}

export function logUserIn(userDetails) {
  const userdata = {
    username: userDetails.username,
    password: userDetails.password
  };
  return (dispatch) => {
    dispatch(requestLogin(userdata.username));
    return request
      .post('/api/users/login')
      .set('Content-Type', 'application/json')
      .send(userdata)
      .end((error, response) => {
        if (!error) {
          setTokenToLocalStorage(response.body.payload.token);
          dispatch(loginSuccessful(response.body.payload));
        } else {
          dispatch(loginFailed(response.message));
        }
      });
  };
}

export function logUserOut() {
  return (dispatch) => {
    dispatch(logoutRequest());
    return request
      .post('/api/users/logout')
      .set('Content-Type', 'application/json')
      .send()
      .end((error, response) => {
        if (!error) {
          window.localStorage.removeItem('token');
          dispatch(logoutSuccessful());
        } else {
          dispatch(logoutFailed(response.message));
        }
      });
  };
}
