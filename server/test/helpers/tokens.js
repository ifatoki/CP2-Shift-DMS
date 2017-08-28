import local from '../../auth/local';

const tokens = {
  overlordToken: local.encodeToken({
    id: 1,
    username: 'itunuworks',
  }),

  userToken: local.encodeToken({
    id: 2,
    username: 'aUserHasNoName',
  }),

  nonExistingUserToken: local.encodeToken({
    id: 0,
    username: 'nonExistingUser',
  })
};

export default tokens;
