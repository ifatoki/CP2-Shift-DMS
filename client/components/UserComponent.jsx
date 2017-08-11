import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
import { getUser, deleteUser } from '../actions/users';

class UserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.isDelete = false;
    this.clickHandler = this.clickHandler.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  clickHandler() {
    if (!this.isDelete) {
      this.props.getUser(this.props.id);
    }
    this.isDelete = false;
  }

  deleteUser() {
    this.isDelete = true;
    this.props.deleteUser(this.props.id);
  }

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
          <Card.Description content={this.props.created} />
        </Card.Content>
        <Card.Content extra>
          <Icon name="user" color="blue" />
          {this.props.role}
          <div className="right floated">
            <Icon name="trash" color="blue" onClick={this.deleteUser} />
          </div>
        </Card.Content>
      </Card>
    );
  }
}

UserComponent.propTypes = {
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

export default connect(null, mapDispatchToProps)(UserComponent);
