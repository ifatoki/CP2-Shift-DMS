import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Timeago from 'timeago-react';
import { Card, Icon } from 'semantic-ui-react';
import UsersActions from '../actions/UsersActions';

const { getUser, deleteUser } = UsersActions;

/**
 * A React component that helps display a single user
 *
 * @export
 * @class User
 * @extends {React.Component}
 */
export class User extends React.Component {
  /**
   * Creates an instance of User.
   * @param {any} props
   * @memberof User
   */
  constructor(props) {
    super(props);
    this.isDelete = false;
    this.clickHandler = this.clickHandler.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  /**
   * @method clickHandler
   *
   * @memberof User
   * @returns {void}
   */
  clickHandler() {
    if (!this.isDelete) {
      this.props.getUser(this.props.id);
    }
    this.isDelete = false;
  }

  /**
   * @method deleteUser
   *
   * @memberof User
   * @returns {void}
   */
  deleteUser() {
    this.isDelete = true;
    this.props.deleteUser(this.props.id);
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof User
   */
  render() {
    return (
      <Card onClick={this.clickHandler} raised>
        <Card.Content>
          <Card.Header
            content={`${this.props.firstname} ${this.props.lastname}`}
          />
          <Card.Meta>
            <a href={`mailto:${this.props.email}`}>{this.props.email}</a>
          </Card.Meta>
          <Card.Meta content={`@${this.props.username}`} />
          <Card.Meta>
            Joined <Timeago datetime={this.props.created} />
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Icon name="user" color="blue" />
          {this.props.role}
          <div className="right floated">
            <Icon
              className="deleteUser"
              name="trash"
              color="blue"
              onClick={this.deleteUser}
            />
          </div>
        </Card.Content>
      </Card>
    );
  }
}

User.propTypes = {
  id: PropTypes.number.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  getUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  getUser,
  deleteUser
};

export default connect(null, mapDispatchToProps)(User);
