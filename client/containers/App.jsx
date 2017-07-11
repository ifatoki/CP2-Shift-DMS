import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, IndexRoute, Route, Redirect } from 'react-router';
import UserContainer from './UserContainer';
import EntryContainer from './EntryContainer';
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
          exact path="/" component={LandingContainer}
        />
        <Route
          exact path="/login" component={LoginContainer}
        />
        <Route
          exact path="/signup" component={SignupContainer}
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

const mapStateToProps = state => (
  {
    isAuthenticated: state.isAuthenticated
  }
);

export default withRouter(connect(mapStateToProps)(App));
