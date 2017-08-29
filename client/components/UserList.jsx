import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import User from './User';

/**
 * Include the users roles in the users
 * @function normalizeUsers
 *
 * @param {Array} roles - List of Roles
 * @param {Array} users - List of Users
 * @returns {object} User with role
 */
const normalizeUsers = (roles, users) => {
  const myRoles = roles.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id] = currentValue.title;
    return accumulator;
  }, {});

  const myUsers = users.reduce((accumulator, currentValue) => {
    const num = currentValue.roleId;
    currentValue.role = myRoles[num];
    return accumulator.concat(currentValue);
  }, []);

  return myUsers;
};

export /** A React Component which holds the User Components
 * @function UserList
 *
 *
 * @param {Object} props - Component Props
 * @returns {void}
 */
const UserList = (props) => {
  const users = normalizeUsers(props.roles, props.users);
  return (
    <div
      className={
        classNames('ui divided items user-list', props.show ?
          'visible-block' : 'not-visible')
      }
    >
      <div
        className={
          classNames('list-status', props.isUpdating ?
            'visible-block' : 'not-visible')
        }
      >
        <Icon loading name="spinner" />
        <p>Fetching Users...</p>
      </div>
      <div
        className={
          classNames((props.isUpdating) ?
            'not-visible' : 'visible-inline-block')}
      >
        <Card.Group>
          {users.map(user => (
            <User
              key={user.id}
              id={user.id}
              username={user.username}
              email={user.email}
              firstname={user.firstname}
              lastname={user.lastname}
              created={user.createdAt}
              role={user.role || ''}
            />
          ))}
        </Card.Group>
      </div>
      <div
        className={
          classNames('list-status', (
            !props.isUpdating && !props.users.length) ?
              'visible-block' : 'not-visible')}
      >
        <Icon name="warning sign" />
        <p>No Users Found!!!</p>
      </div>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  roles: PropTypes.arrayOf(PropTypes.object),
  show: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired
};

UserList.defaultProps = {
  users: [],
  roles: [],
};

/**
 * Maps state to Component Props
 * @function mapStateToProps
 *
 * @param {Object} state - Redux state
 * @return {object} props
 */
const mapStateToProps = state => ({
  users: state.user.users,
  roles: state.user.roles,
  isUpdating: state.user.usersUpdating
});

export default connect(mapStateToProps)(UserList);
