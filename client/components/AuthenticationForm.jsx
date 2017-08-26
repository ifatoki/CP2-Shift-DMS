import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import lodash from 'lodash';
import PropTypes from 'prop-types';

/**
 * @function AuthenticationForm
 *
 * @param {any} props
 * @returns {void}
 */
const AuthenticationForm = (props) => {
  const loginFormDetails = {
    name: 'login',
    buttonContent: 'Sign in',
    baseContent: {
      loginToggleContent: 'Create an account',
      text: 'New user? '
    },
    header: 'Lets get you signed in',
    fields1: [{
      id: 'loginUserName',
      placeholder: 'Username',
      name: 'username',
      type: 'text'
    }, {
      id: 'loginPassword',
      placeholder: 'Password',
      name: 'password',
      type: 'password'
    }]
  };

  const signUpFormDetails = {
    name: 'signup',
    buttonContent: 'Create an account',
    baseContent: {
      loginToggleContent: 'Sign in',
      text: 'Already have an account? '
    },
    header: 'Create your account',
    fields1: [{
      placeholder: 'First Name',
      name: 'firstname',
      type: 'text'
    }, {
      placeholder: 'Last Name',
      name: 'lastname',
      type: 'text'
    }, {
      placeholder: 'Email Address',
      name: 'email',
      type: 'email'
    }, {
      placeholder: 'Username',
      name: 'username',
      type: 'text'
    }],
    password: [{
      placeholder: 'Password',
      name: 'password',
      type: 'password'
    }, {
      placeholder: 'Confirm Password',
      name: 'confirmPassword',
      type: 'password'
    }]
  };

  const currentDetails = props.isLogin ? loginFormDetails : signUpFormDetails;

  return (
    <form className="ui form segment">
      <div className="field">
        {currentDetails.header}
      </div>
      {lodash.map(currentDetails.fields1, field => (
        <div className="field" key={field.name}>
          <input
            placeholder={field.placeholder}
            name={field.name}
            type={field.type}
            onChange={props.onChange}
          />
        </div>
      ))}
      {!props.isLogin ? (
        <div className="field">
          <Dropdown
            placeholder="Roles"
            selection
            name="roleId"
            options={props.roles}
            onChange={props.onChange}
          />
        </div>
        ) : ''
      }
      {!props.isLogin ? (
        <div className="two fields">
          {lodash.map(currentDetails.password, field => (
            <div className="field" key={field.name}>
              <input
                placeholder={field.placeholder}
                type={field.type}
                name={field.name}
                onChange={props.onChange}
              />
            </div>
          ))}
        </div>
      ) : ''}
      <div
        className="ui primary fluid submit button"
        id={currentDetails.name}
        name={currentDetails.name}
        onClick={props.isLogin ? props.onLoginSubmit : props.onSignUpSubmit}
      >
        {currentDetails.buttonContent}
      </div>
      <div className="login-toggle">
        {currentDetails.baseContent.text}
        <a href="" onClick={props.toggleShowLogin}>
          {currentDetails.baseContent.loginToggleContent}
        </a>
      </div>
    </form>
  );
};

AuthenticationForm.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLogin: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  toggleShowLogin: PropTypes.func.isRequired,
  onSignUpSubmit: PropTypes.func.isRequired,
  onLoginSubmit: PropTypes.func.isRequired
};

AuthenticationForm.defaultProps = {
  isLogin: false
};

export default AuthenticationForm;
