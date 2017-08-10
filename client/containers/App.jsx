import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router';
import LandingContainer from './LandingContainer';
import LoginContainer from './LoginContainer';
import HomeContainer from './HomeContainer';

class App extends Component {
  render() {
    return (
      <div style={{ height: '100%' }} >
        <Route
          exact path="/" component={
            this.props.isAuthenticated ?
            () => <Redirect to="/home" /> :
            LandingContainer
          }
        />
        <Route
          exact path="/login" component={
            this.props.isAuthenticated ?
            () => <Redirect to="/home" /> :
            LoginContainer
          }
        />
        <Route
          exact path="/home" component={
            this.props.isAuthenticated ?
            HomeContainer :
            () => <Redirect to="/login" />
          }
        />
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

export default withRouter(connect(mapStateToProps)(App));
