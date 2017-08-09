import React from 'react';
import PropType from 'prop-types';
import toastr from 'toastr';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UsersActions from '../actions/UsersActions';

const { modifyUser, cancelUser } = UsersActions;

const editModes = {
  READ: 'READ',
  WRITE: 'WRITE'
};

const initialState = {
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  createdAt: '',
  roleId: 3,
  role: '',
  isOverlord: false,
  accessMode: editModes.READ,
  changePassword: false,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  edited: false
};

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

export class UserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onChange = this.onChange.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.cancelUser = this.cancelUser.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentUser, signedInRole, currentUserModified, currentUserErrorMessage
    } = nextProps;
    if (currentUserErrorMessage) {
      toastr.error(currentUserErrorMessage, 'Validation Error');
    } else if (this.props.currentUserModifying) {
      if (currentUserModified) {
        this.setState({
          accessMode: editModes.READ
        }, () => toastr.success(
          'User details modified successfully', 'Success'
        ));
      }
    }
    if (currentUser) {
      this.setState({
        username: currentUser.username,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        email: currentUser.email,
        createdAt: currentUser.createdAt,
        roleId: currentUser.roleId,
        role: currentUser.role,
        isOverlord: signedInRole === 'overlord'
      });
    }
  }

  onChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]:
        event.target.name === 'username' ?
          event.target.value.substring(1) :
          event.target.value,
      edited: true
    });
  }

  resetModal() {
    this.setState(initialState);
  }

  handleSelectionChange(event, { checked }) {
    this.setState({ changePassword: checked });
  }

  saveUser(event) {
    event.preventDefault();
    const newUserData = {};
    const { currentUser } = this.props;
    if (this.state.firstname !== currentUser.firstname) {
      newUserData.firstname = this.state.firstname;
    }
    if (this.state.lastname !== currentUser.lastname) {
      newUserData.lastname = this.state.lastname;
    }
    if (this.state.username !== currentUser.username) {
      newUserData.username = this.state.username;
    }
    if (this.state.email !== currentUser.email) {
      newUserData.email = this.state.email;
    }
    if (this.state.changePassword) {
      newUserData.currentPassword = this.state.currentPassword;
      newUserData.newPassword = this.state.newPassword;
      newUserData.confirmPassword = this.state.confirmPassword;
    }
    this.props.modifyUser(currentUser.id, newUserData);
  }

  editUser(event) {
    event.preventDefault();
    this.setState({
      accessMode: editModes.WRITE
    });
  }

  cancelUser(event) {
    event.preventDefault();
    this.setState(initialState, () => this.props.cancelUser());
  }

  render() {
    return (
      <div className="ui user mini modal userManager">
        <Modal.Header>
          {this.state.accessMode === editModes.WRITE ?
            'Make your changes here' :
            `${this.state.firstname.toUpperCase()} 
            ${this.state.lastname.toUpperCase()}`
          }
        </Modal.Header>
        <Modal.Content >
          <div
            style={{
              display:
                this.state.accessMode === editModes.WRITE ?
                'block' : 'none'
            }}
          >
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  className="firstname"
                  label="First name"
                  placeholder="First name"
                  name="firstname"
                  value={this.state.firstname}
                  onChange={this.onChange}
                />
                <Form.Input
                  id="lastname"
                  label="Last name"
                  placeholder="Last name"
                  name="lastname"
                  value={this.state.lastname}
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  label="Username"
                  placeholder="Username"
                  name="username"
                  value={`@${this.state.username}`}
                  onChange={this.onChange}
                />
                <Form.Input
                  label="Email"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </Form.Group>
              <Form.Checkbox
                label="Change my password"
                checked={this.state.changePassword}
                onChange={this.handleSelectionChange}
              />
              <div
                style={{
                  display:
                    this.state.changePassword ?
                    'block' : 'none'
                }}
              >
                <Form.Group widths="equal">
                  <Form.Input
                    type="password"
                    label="Current Password"
                    placeholder="Current Password"
                    name="currentPassword"
                    value={this.state.currentPassword}
                    onChange={this.onChange}
                  />
                  <Form.Input
                    type="password"
                    label="New Password"
                    placeholder="New Password"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={this.onChange}
                  />
                  <Form.Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.onChange}
                  />
                </Form.Group>
              </div>
            </Form>
          </div>
          <div
            style={{
              display:
                this.state.accessMode === editModes.READ ?
                'block' : 'none'
            }}
          >
            <Modal.Description>
              <Header>{`@${this.state.username}`}</Header>
              <p>
                <a href={`mailto:${this.state.email}`}>
                  {this.state.email}
                </a>
              </p>
              <p>
                <i className="blue user icon" />
                {this.state.role}
              </p>
            </Modal.Description>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <div
            className="ui primary edit icon button"
            onClick={this.editUser}
            style={{
              display: (
                (!this.state.isOverlord ||
                  (this.state.isOverlord && this.state.roleId === 1)
                ) && this.state.accessMode === editModes.READ
              ) ? 'inline-block' : 'none'
            }}
          >
            <i className="edit icon" />
          </div>
          <div
            className="ui primary save icon button"
            onClick={this.saveUser}
            style={{
              display:
                this.state.edited && this.state.accessMode === editModes.WRITE ?
                'inline-block' : 'none'
            }}
          >
            <i className="save icon" />
          </div>
          <Button className="cancel" color="grey" onClick={this.cancelUser}>
            Cancel
          </Button>
        </Modal.Actions>
      </div>
    );
  }
}

UserManager.propTypes = {
  currentUser: PropType.object,
  cancelUser: PropType.func.isRequired,
  modifyUser: PropType.func.isRequired,
  signedInRole: PropType.string.isRequired,
  currentUserModifying: PropType.bool.isRequired,
  currentUserModified: PropType.bool.isRequired,
  currentUserErrorMessage: PropType.string.isRequired
};

UserManager.defaultProps = {
  currentUser: {}
};

const mapDispatchToProps = {
  modifyUser,
  cancelUser
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  signedInRole: state.user.role,
  currentUserModifying: state.user.currentUserModifying,
  currentUserModified: state.user.currentUserModified,
  currentUserErrorMessage: state.user.currentUserErrorMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(UserManager);
