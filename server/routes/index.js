import confirmRole from '../controllers/middleware/confirmRole';
import AuthHelpers from '../auth/AuthHelpers';
import {
  UsersController,
  DocumentsController,
  RolesController,
  RightsController
} from '../controllers';

/**
 * Function index that handles all endpoints
 * @function index
 *
 * @param {any} app - instance of Express app
 *
 * @return {void}
 */
const index = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Shift-DMS API!',
  }));

  // USER END-POINTS

  // logs a user in
  app.post('/api/v1/users/login', UsersController.login);
  // creates a new user record
  app.post('/api/v1/users', confirmRole, UsersController.create);

  // From here on, middleware that confirms if a user is logged in.

  // logs a user out
  app.post(
    '/api/v1/users/logout',
    AuthHelpers.confirmAuthentication,
    UsersController.logout
  );
  // find all users
  app.get(
    '/api/v1/users/',
    AuthHelpers.confirmAuthentication,
    UsersController.fetchAll
  );
  // find user with the specified id
  app.get(
    '/api/v1/users/:id',
    AuthHelpers.confirmAuthentication,
    UsersController.fetchOne
  );
  // update the user with the specified id's attributes
  app.put(
    '/api/v1/users/:id',
    AuthHelpers.confirmAuthentication,
    UsersController.updateUser
  );
  // delete the specified user
  app.delete(
    '/api/v1/users/:id',
    AuthHelpers.confirmAuthentication,
    UsersController.deleteUser
  );
  // find all the documents belonging to the specified user
  app.get(
    '/api/v1/users/:id/documents',
    AuthHelpers.confirmAuthentication,
    UsersController.fetchUserDocuments
  );
  // search for user
  app.get(
    '/api/v1/search/users/',
    AuthHelpers.confirmAuthentication,
    UsersController.search
  );


  // DOCUMENT END-POINTS

  // create a new document record
  app.post(
    '/api/v1/documents',
    AuthHelpers.confirmAuthentication,
    DocumentsController.create
  );
  // find all documents
  app.get('/api/v1/documents/',
    AuthHelpers.confirmAuthentication,
    DocumentsController.fetchAll
  );
  // find the specified document
  app.get(
    '/api/v1/documents/:id',
    AuthHelpers.confirmAuthentication,
    DocumentsController.fetchOne
  );
  // update the specified documents attributes
  app.put(
    '/api/v1/documents/:id',
    AuthHelpers.confirmAuthentication,
    DocumentsController.update
  );
  // delete the specified document
  app.delete(
    '/api/v1/documents/:id',
    AuthHelpers.confirmAuthentication,
    DocumentsController.delete
  );
  // search for a document
  app.get(
    '/api/v1/search/documents/',
    AuthHelpers.confirmAuthentication,
    DocumentsController.search
  );
  // add a new role to the specified document
  app.post(
    '/api/v1/documents/:documentId',
    AuthHelpers.confirmAuthentication,
    DocumentsController.addUser
  );


  // ROLE END-POINTS

  // create a new role record
  app.post(
    '/api/v1/roles',
    AuthHelpers.confirmAuthentication,
    RolesController.create
  );
  // find all roles
  app.get(
    '/api/v1/roles',
    RolesController.list
  );

  // RIGHT END-POINTS

  // create a new right record
  app.post(
    '/api/v1/rights',
    AuthHelpers.confirmAuthentication,
    RightsController.create
  );
  // find all rights
  app.get(
    '/api/v1/rights',
    AuthHelpers.confirmAuthentication,
    RightsController.list
  );
};

export default index;
