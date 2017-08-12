import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import toastr from 'toastr';
import { connect } from 'react-redux';
import _ from 'lodash';
import UsersActions from '../actions/UsersActions';

const { logUserIn, signUserUp, fetchAllRoles } = UsersActions;

class LandingContainer extends React.Component {
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
      roles: []
    };
    this.onChange = this.onChange.bind(this);
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllRoles();
  }

  componentWillReceiveProps({ currentUserErrorMessage, roles }) {
    if (currentUserErrorMessage) {
      toastr.error(currentUserErrorMessage, 'Validation Error');
    }
    this.setState({
      roles: _.reduce(roles, (accumulator, role) => {
        return accumulator.concat({
          key: role.id,
          text: role.title,
          value: role.id
        });
      }, [])
    });
  }

  onChange(event, data) {
    if (data) {
      this.setState({ [data.name]: data.value });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  onLoginSubmit(event) {
    event.preventDefault();
    this.props.logUserIn(this.state);
  }

  onSignUpSubmit(event) {
    event.preventDefault();
    this.props.signUserUp(this.state);
  }

  render() {
    return (
      <div style={{ height: 'inherit', background: 'aliceblue' }}>
        <div className="ui middle aligned center aligned grid" style={{ height: 'inherit' }}>
          <div className="column" style={{ width: '400px' }}>
            <form className="ui form segment">
              <p>Lets get you signed in</p>
              <div className="field">
                <input
                  placeholder="Username"
                  name="username"
                  type="text"
                  onChange={this.onChange}
                />
              </div>
              <div className="field">
                <input
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={this.onChange} />
              </div>
              <div
                className="ui primary fluid submit button"
                name="login"
                onClick={this.onLoginSubmit}
              >
                Sign in
              </div>
            </form>
          </div>
          <div className="column" style={{ width: '400px', verticalAlign: 'middle' }}>
            <form className="ui form segment">
              <div className="field">
                Create your account
              </div>
              <div className="field">
                <input placeholder="First Name" name="firstname" type="text" onChange={this.onChange} />
              </div>
              <div className="field">
                <input placeholder="Last Name" name="lastname" type="text" onChange={this.onChange} />
              </div>
              <div className="field">
                <input placeholder="Email Address" name="email" type="email" onChange={this.onChange} />
              </div>
              <div className="field">
                <input placeholder="Username" name="username" type="text" onChange={this.onChange} />
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
                  <input placeholder="Password" type="password" name="password" onChange={this.onChange} />
                </div>
                <div className="field">
                  <input placeholder="Confirm Password" type="password" name="confirmPassword" onChange={this.onChange} />
                </div>
              </div>
              <div
                className="ui primary fluid submit button"
                name="signup"
                onClick={this.onSignUpSubmit}
              >
                Create an account
              </div>
            </form>
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

const mapStateToProps = state => ({
  currentUserErrorMessage: state.user.currentUserErrorMessage,
  roles: state.user.roles
});

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
