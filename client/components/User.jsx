import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
// import { getUser } from '../actions/Users';

class User extends React.Component {
  constructor(props) {
    super(props);
    // this.clickHander = this.clickHander.bind(this);
  }

  clickHandler() {
    // this.props.getUser(this.props.UserId);
  }

  render() {
    return (
      <Card raised>
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
            <Icon name="trash" color="blue" />
          </div>
        </Card.Content>
      </Card>
    );
  }
}

User.propTypes = {
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired
};

export default User;
