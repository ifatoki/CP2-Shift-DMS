import local from '../../auth/local';

const overlordToken = local.encodeToken({
  id: 1,
  username: 'itunuworks',
});

const userToken = local.encodeToken({
  id: 2,
  username: 'aUserHasNoName',
});

const nonExistingUserToken = local.encodeToken({
  id: 0,
  username: 'nonExistingUser',
});

export { overlordToken, userToken, nonExistingUserToken };
