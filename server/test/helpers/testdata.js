import faker from 'faker';
import _ from 'lodash';

const roles = ['overlord', 'admin', 'success', 'learning', 'fellows'];
const getUsers = _.reduce(roles, (users, role) => {
  users[role] = {
    roleId: roles.indexOf(role) + 1,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(8)
  };
  return users;
}, {});

const postData = {
  users: getUsers
};

export default postData;
