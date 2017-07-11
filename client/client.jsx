import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createBrowserHistory from 'history/createBrowserHistory';
import appReducer from './reducers/index';
import App from './containers/App';
// import routes from './routes';

const history = createBrowserHistory();

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  appReducer,
  composeEnhancers(
    applyMiddleware(...middleware)
  ));

if (window.localStorage.token) {
  // if the token is valid, set authorization headers.
  // confirmAuthentication(window.localStorage.token);
}

render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
