import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import User from './User';

const normalizeUsers = (roles, users) => {
  const myRoles = roles.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id] = currentValue.title;
    return accumulator;
  }, {});

  const myUsers = users.reduce((accumulator, currentValue) => {
    const num = currentValue.RoleId;
    currentValue.role = myRoles[num];
    return accumulator.concat(currentValue);
  }, []);
  return myUsers;
};

const UserList = (props) => {
  const users = normalizeUsers(props.roles, props.users);
  return (
    <div
      className="ui divided items" style={{
        paddingTop: '10px',
        marginTop: '0px',
        overflowY: 'scroll',
        height: '90%',
        display: props.show ? 'block' : 'none'
      }}
    >
      <Card.Group>
        {users.map(user => (
          <User
            key={user.id}
            username={user.username}
            email={user.email_address}
            firstname={user.first_name}
            lastname={user.last_name}
            created={user.createdAt}
            role={user.role || ''}
          />
        ))}
      </Card.Group>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  roles: PropTypes.arrayOf(PropTypes.object),
  show: PropTypes.bool.isRequired
};

UserList.defaultProps = {
  users: [],
  roles: [],
};

const mapStateToProps = state => ({
  users: state.user.users,
  roles: state.user.roles
});

export default connect(mapStateToProps)(UserList);
