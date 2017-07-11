import React from 'react';
import { Switch, Route, Router, IndexRoute } from 'react-router-dom';
import LandingContainer from './containers/LandingContainer';
import LoginContainer from './containers/LoginContainer';
import SignupContainer from './containers/SignupContainer';
import HomeContainer from './containers/HomeContainer';
import DocumentContainer from './containers/DocumentContainer';
import ProfileContainer from './containers/ProfileContainer';

const routes = (
  <Route>
    <IndexRoute
      component={LandingContainer}
    />
    <Route
      exact path="/login" component={LoginContainer}
    />
    <Route
      exact path="/signup" component={SignupContainer}
    />
    <Route
      exact path="/home" component={HomeContainer}
    />
    <Route
      exact path="/document" component={DocumentContainer}
    />
    <Route
      exact path="/myprofile" component={ProfileContainer}
    />
  </Route>
);

export default routes;
