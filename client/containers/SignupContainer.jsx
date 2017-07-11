import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/Index';

class SignUpContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      roleId: 1
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
    this.props.signUserUp(this.state);
  }

  render() {
    return (
      <div>
        <h1>
          This is me in the Signup page
        </h1>
        <form className="ui form segment">
          <p>Lets go ahead and get you signed up.</p>
          <div className="two fields">
            <div className="field">
              <label>First Name</label>
              <input placeholder="Micheal" name="firstname" type="text" onChange={this.onChange} />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input placeholder="Isaac" name="lastname" type="text" onChange={this.onChange} />
            </div>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Email</label>
              <input placeholder="me@email.com" name="email" type="email" onChange={this.onChange} />
            </div>
            <div className="field">
              <label>Username</label>
              <input placeholder="Username" name="username" type="text" onChange={this.onChange} />
            </div>
          </div>
          <div className="field">
            <label>Role</label>
            <select className="ui dropdown">
              <option value="1">Administrator</option>
              <option value="2">Editor</option>
              <option value="3">Reader</option>
            </select>
          </div>
          <div className="two fields">
            <div className="field">
              <label>Password</label>
              <input placeholder="Password" type="password" name="password" onChange={this.onChange} />
            </div>
            <div className="field">
              <label>Password</label>
              <input placeholder="Confirm Password" type="password" name="confirmPassword" onChange={this.onChange} />
            </div>
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

SignUpContainer.propTypes = {
  signUserUp: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

export default connect(null, mapDispatchToProps)(SignUpContainer);
