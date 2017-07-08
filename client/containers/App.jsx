import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      this.props.isAuthenticated
      ?
        <h1>
          User authenticated component
        </h1>
      :
        <h1>
          User NOT authenticated component
        </h1>
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

export default connect(mapStateToProps)(App);
