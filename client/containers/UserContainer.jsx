import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeContainer from './HomeContainer';
import DocumentContainer from './DocumentContainer';
import ProfileContainer from './ProfileContainer';

class UserContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Hi there! I am the proud to be the user container</h1>
        {this.props.children}
      </div>
    );
  }
}

export default UserContainer;
