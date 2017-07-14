import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router';
import LandingContainer from './LandingContainer';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';
import HomeContainer from './HomeContainer';
import DocumentContainer from './DocumentContainer';
import ProfileContainer from './ProfileContainer';

class App extends Component {
  render() {
    return (
      <div>
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
          exact path="/signup" component={
            this.props.isAuthenticated ?
            () => <Redirect to="/home" /> :
            SignupContainer
          }
        />
        <Route
          exact path="/home" component={
            this.props.isAuthenticated ?
            HomeContainer :
            () => <Redirect to="/login" />
          }
        />
        <Route
          exact path="/document" component={
            this.props.isAuthenticated ?
            DocumentContainer :
            () => <Redirect to="/login" />
          }
        />
        <Route
          exact path="/myprofile" component={
            this.props.isAuthenticated ?
            ProfileContainer :
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
