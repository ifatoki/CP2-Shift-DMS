import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import toastr from 'toastr';
import { connect } from 'react-redux';
import lodash from 'lodash';
import classNames from 'classnames';
import usersActions from '../actions/usersActions';

const { logUserIn, signUserUp, fetchAllRoles } = usersActions;

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

/**
 * @export
 * @class LandingContainer
 * @extends {React.Component}
 */
export class LandingContainer extends React.Component {
  /**
   * Creates an instance of LandingContainer.
   * @param {any} props
   * @memberof LandingContainer
   */
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: 2,
      roles: [],
      showLogin: true
    };
    this.onChange = this.onChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
    this.toggleShowLogin = this.toggleShowLogin.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllRoles();
  }

  componentWillReceiveProps({ currentUserErrorMessage, roles }) {
    if (currentUserErrorMessage) {
      toastr.error(currentUserErrorMessage, 'Validation Error');
    }
    this.setState({
      roles: lodash.reduce(roles, (accumulator, role) =>
        accumulator.concat({
          key: role.id,
          text: role.title,
          value: role.id
        }), [])
    });
  }

  /**
   * @method onChange
   *
   * @param {any} event
   * @param {any} data
   * @memberof LandingContainer
   * @returns {void}
   */
  onChange(event, data) {
    if (data) {
      this.setState({ [data.name]: data.value });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  /**
   * @method onLoginSubmit
   *
   * @param {any} event
   * @memberof LandingContainer
   * @returns {void}
   */
  onLoginSubmit(event) {
    event.preventDefault();
    this.props.logUserIn(this.state);
  }

  /**
   * @method onSignUpSubmit
   *
   * @param {any} event
   * @memberof LandingContainer
   * @returns {void}
   */
  onSignUpSubmit(event) {
    event.preventDefault();
    this.props.signUserUp(this.state);
  }

  /**
   * @method toggleShowLogin
   *
   * @param {any} event
   * @memberof LandingContainer
   * @returns {void}
   */
  toggleShowLogin(event) {
    event.preventDefault();
    this.setState({
      showLogin: !this.state.showLogin
    });
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof LandingContainer
   */
  render() {
    return (
      <div
        className="landing-container inherit"
      >
        <div
          className="ui grid inherit landing-sub-container"
        >
          <div className="ten wide column inherit">
            <div className="ui middle aligned center aligned grid inherit">
              <div className="column landing-info">
                <p className="app-name">Shift-DMS</p>
                <p>
                  Manage documents, roles, privacy and collaboration on the fly
                  all with one account, one tool and one DMS. With inbuilt
                  authentication using JWT, Role sharing capacity across your
                  organisation and an Overlord profile to help manage public
                  documents and users so we have no profane public documents.
                </p>
              </div>
            </div>
          </div>
          <div
            className="six wide column inherit"
          >
            <div
              className="ui middle aligned center aligned grid inherit"
            >
              <div
                className={classNames('column user-auth',
                  this.state.showLogin ? 'not-visible' : 'visible-block'
                )}
              >
                <form className="ui form segment">
                  <div className="field">
                    Create your account
                  </div>
                  <div className="field">
                    <input
                      placeholder="First Name"
                      name="firstname"
                      type="text"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="field">
                    <input
                      placeholder="Last Name"
                      name="lastname"
                      type="text"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="field">
                    <input
                      placeholder="Email Address"
                      name="email"
                      type="email"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="field">
                    <input
                      placeholder="Username"
                      name="username"
                      type="text"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="field">
                    <Dropdown
                      placeholder="Roles"
                      selection
                      name="roleId"
                      options={this.state.roles}
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="two fields">
                    <div className="field">
                      <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="field">
                      <input
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div
                    className="ui primary fluid submit button"
                    id="signup"
                    name="signup"
                    onClick={this.onSignUpSubmit}
                  >
                    Create an account
                  </div>
                  <div className="login-toggle">
                    Already have an account? &nbsp;
                    <a href="" onClick={this.toggleShowLogin}>
                      Sign In
                    </a>
                  </div>
                </form>
              </div>
              <div
                className={classNames('column user-auth',
                  this.state.showLogin ? 'visible-block' : 'not-visible'
                )}
              >
                <form className="ui form segment">
                  <p>Lets get you signed in</p>
                  <div className="field">
                    <input
                      id="loginUserName"
                      placeholder="Username"
                      name="username"
                      type="text"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="field">
                    <input
                      id="loginPassword"
                      placeholder="Password"
                      type="password"
                      name="password"
                      onChange={this.onChange}
                    />
                  </div>
                  <div
                    className="ui primary fluid submit button"
                    id="login"
                    name="login"
                    onClick={this.onLoginSubmit}
                  >
                    Sign in
                  </div>
                  <div className="login-toggle">
                    New user? &nbsp;
                    <a href="" onClick={this.toggleShowLogin}>
                      Create an account
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LandingContainer.propTypes = {
  logUserIn: PropTypes.func.isRequired,
  signUserUp: PropTypes.func.isRequired,
  currentUserErrorMessage: PropTypes.string.isRequired,
  fetchAllRoles: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  logUserIn,
  signUserUp,
  fetchAllRoles
};

/**
 * @function mapStateToProps
 *
 * @param {any} state
 * @return {object} props
 */
const mapStateToProps = state => ({
  currentUserErrorMessage: state.user.currentUserErrorMessage,
  roles: state.user.roles
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
