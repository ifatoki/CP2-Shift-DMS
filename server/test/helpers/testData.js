import faker from 'faker';
import lodash from 'lodash';

const roles = ['overlord', 'admin', 'success', 'learning', 'fellows'];
const getUsers = lodash.reduce(roles, (users, role) => {
  const pass = faker.internet.password(8);
  users[role] = {
    roleId: roles.indexOf(role) + 1,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: pass,
    confirmPassword: pass
  };
  return users;
}, {});

const testData = {
  users: getUsers
};

export default testData;
