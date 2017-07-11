import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/Index';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    this.props.logUserIn(this.state);
  }

  render() {
    return (
      <div>
        <h1>
          This is me in the Login page
        </h1>
        <form className="ui form segment">
          <p>Lets go ahead and get you signed up.</p>
          <div className="field">
            <label>Username</label>
            <input placeholder="Username" name="username" type="text" onChange={this.onChange} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" onChange={this.onChange} />
          </div>
          <div className="inline field">
            <div className="ui checkbox">
              <input type="checkbox" name="terms" />
              <label>I agree to the Terms and Conditions</label>
            </div>
          </div>
          <div className="ui primary submit button" onClick={this.onSubmit}>Submit</div>
        </form>
      </div>
    );
  }
}

LoginContainer.propTypes = {
  logUserIn: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

export default connect(null, mapDispatchToProps)(LoginContainer);
