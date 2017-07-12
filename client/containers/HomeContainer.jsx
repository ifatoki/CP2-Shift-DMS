import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/user';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.logUserOut();
  }

  render() {
    return (
      <div>
        <h1>
          Yah! I am logged in to the HOME PAGE
        </h1>
        <div
          className="ui primary submit button"
          onClick={this.onSubmit}
        >Log Out</div>
      </div>
    );
  }
}

LoginContainer.propTypes = {
  logUserOut: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch);
export default connect(null, mapDispatchToProps)(LoginContainer);
