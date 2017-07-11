import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingContainer from './LandingContainer';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';

class EntryContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Hi everyone, I am the entry EntryContainer</h1>
        {this.props.children}
      </div>
    );
  }
}

export default EntryContainer;
