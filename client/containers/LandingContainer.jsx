import React from 'react';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import { connect } from 'react-redux';
import lodash from 'lodash';
import classNames from 'classnames';
import AuthenticationForm from '../components/AuthenticationForm';
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
                <AuthenticationForm
                  roles={this.state.roles}
                  onChange={this.onChange}
                  toggleShowLogin={this.toggleShowLogin}
                  onSignUpSubmit={this.onSignUpSubmit}
                  onLoginSubmit={this.onLoginSubmit}
                />
              </div>
              <div
                className={classNames('column user-auth',
                  this.state.showLogin ? 'visible-block' : 'not-visible'
                )}
              >
                <AuthenticationForm
                  isLogin
                  roles={this.state.roles}
                  onChange={this.onChange}
                  toggleShowLogin={this.toggleShowLogin}
                  onSignUpSubmit={this.onSignUpSubmit}
                  onLoginSubmit={this.onLoginSubmit}
                />
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
