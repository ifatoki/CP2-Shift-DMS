import moxios from 'moxios';
import thunk from 'redux-thunk';
import faker from 'faker';
import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import ActionTypes from '../../actions/ActionTypes';
import UsersActions from '../../actions/UsersActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('User Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });
  const password = faker.internet.password();
  const user = {
    password,
    id: 1,
    email: faker.internet.email(),
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    confirmPassword: password,
    roleId: 2,
  };
  const errorUser = {
    id: 1,
    firstname: 'Itunuloluwa',
    lastname: 'Fatoki',
    username: faker.internet.userName(),
    roleId: 2,
  };

  describe('Create Document Action', () => {
    it('creates documents', (done) => {
      moxios.stubRequest('api/v1/users', {
        status: 201,
        response: {
          user
        }
      });
      const store = mockStore({});
      store.dispatch(UsersActions.signUserUp(user))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(ActionTypes.SIGNUP_REQUEST);
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.SIGNUP_SUCCESSFUL);
        expect(store.getActions()[1].payload)
          .toEqual(user);
      });
      done();
    });

    it('dispatch error action if theres any error', () => {
      moxios.stubRequest('api/v1/users', {
        status: 400,
        response: {
          message: 'title is required<br/>'
        }
      });

      const store = mockStore({});
      store.dispatch(UsersActions.signUserUp(errorUser));
      expect(store.getActions()[1].type)
        .toEqual(ActionTypes.SIGNUP_FAILED);
      expect(store.getActions()[1].payload)
        .toEqual('password is required<br/>email is required<br/>');
    });
  });

  describe('fetch all documents action', () => {
    const users = _.map([1, 2, 3], (id) => {
      return {
        id,
        email: faker.internet.email(),
        username: faker.internet.userName(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName()
      };
    });
    it('fetches documents', (done) => {
      moxios.stubRequest('api/v1/users', {
        status: 200,
        response: {
          users
        }
      });

      const store = mockStore({});
      store.dispatch(UsersActions.fetchAllUsers())
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(ActionTypes.FETCH_USERS_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          users
        );
      });
      done();
    });
  });

  describe('get single document', () => {
    it('gets a single document from db', (done) => {
      moxios.stubRequest(`api/v1/users/${user.id}`, {
        status: 200,
        response: { user }
      });

      const store = mockStore({});
      store.dispatch(UsersActions.getUser(user.id))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_GET_SUCCESSFUL);
        expect(store.getActions()[1].payload.user).toEqual(
          user
        );
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/users/3000000', {
        status: 404,
        response: {
          message: 'user not found'
        }
      });
      const store = mockStore({});
      store.dispatch(UsersActions.getUser(3000000))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.USER_GET_FAILED);
        expect(store.getActions()[1].payload).toEqual({
          message: 'user not found'
        });
      });
      done();
    });
  });

  describe('Update Documents', () => {
    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest(`api/v1/users/${user.id}`, {
        status: 200,
        response: {
          user
        }
      });

      const store = mockStore({});
      store.dispatch(UsersActions.modifyUser(user.id, user))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(ActionTypes.USER_MODIFY_REQUEST);
        expect(store.getActions()[1].payload)
          .toEqual(user);
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/v1/USERs/3000000', {
        status: 404,
        response: {
          message: 'user not found'
        }
      });
      const store = mockStore({});
      store.dispatch(UsersActions.modifyUser(3000000, errorUser))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.USER_MODIFY_FAILED);
        expect(store.getActions()[1].payload).toEqual(
          'user not found'
        );
      });
      done();
    });
  });

  describe('Delete Documents', () => {
    it('deletes a single document', (done) => {
      moxios.stubRequest('api/v1/users/1', {
        status: 200,
        response: {
          message: 'user deleted successfully'
        }
      });

      const store = mockStore({});
      store.dispatch(UsersActions.deleteUser(1))
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(ActionTypes.USER_DELETE_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          'user deleted successfully'
        );
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/users/3000000', {
        status: 404,
        response: {
          message: 'user not found'
        }
      });
      const store = mockStore({});
      store.dispatch(UsersActions.deleteUser(3000000, errorUser))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_DELETE_FAILED);
        expect(store.getActions()[1].payload).toEqual({
          message: 'user not found'
        });
      });
      done();
    });
  });

  describe('Search documents', () => {
    it('returns data if matching documents are found', () => {
      const store = mockStore({});
      store.dispatch(UsersActions.cancelUser());
      expect(store.getActions()[0].type)
      .toEqual(ActionTypes.USER_CANCELLED);
    });
  });
});
