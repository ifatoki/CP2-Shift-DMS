import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router';
import LandingContainer from './LandingContainer';
import HomeContainer from './HomeContainer';

export /** The Root Application Component
 * @function App
 *
 * @param {any} props
 * @return {void}
 */
const App = props => (
  <div className="app inherit">
    <Route
      exact
      path="/"
      component={
        props.isAuthenticated ?
        () => <Redirect to="/home" /> :
        LandingContainer
      }
    />
    <Route
      exact
      path="/home"
      component={
        props.isAuthenticated ?
        HomeContainer :
        () => <Redirect to="/" />
      }
    />
  </div>
);

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

export default withRouter(connect(mapStateToProps)(App));
