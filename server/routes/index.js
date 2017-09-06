import confirmRole from '../controllers/middleware/confirmRole';
import helpers from '../auth/helpers';
import {
  usersController,
  documentsController,
  rolesController,
  rightsController
} from '../controllers';

const index = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Shift-DMS API!',
  }));

  // USER END-POINTS

  // logs a user in
  app.post('/api/v1/users/login', usersController.login);
  // creates a new user record
  app.post('/api/v1/users', confirmRole, usersController.create);

  // From here on, middleware that confirms if a user is logged in.

  // logs a user out
  app.post(
    '/api/v1/users/logout',
    helpers.confirmAuthentication,
    usersController.logout
  );
  // find all users
  app.get(
    '/api/v1/users/',
    helpers.confirmAuthentication,
    usersController.fetchAll
  );
  // find user with the specified id
  app.get(
    '/api/v1/users/:id',
    helpers.confirmAuthentication,
    usersController.fetchOne
  );
  // update the user with the specified id's attributes
  app.put(
    '/api/v1/users/:id',
    helpers.confirmAuthentication,
    usersController.updateUser
  );
  // delete the specified user
  app.delete(
    '/api/v1/users/:id',
    helpers.confirmAuthentication,
    usersController.deleteUser
  );
  // find all the documents belonging to the specified user
  app.get(
    '/api/v1/users/:id/documents',
    helpers.confirmAuthentication,
    usersController.fetchUserDocuments
  );
  // search for user
  app.get(
    '/api/v1/search/users/',
    helpers.confirmAuthentication,
    usersController.search
  );


  // DOCUMENT END-POINTS

  // create a new document record
  app.post(
    '/api/v1/documents',
    helpers.confirmAuthentication,
    documentsController.create
  );
  // find all documents
  app.get('/api/v1/documents/',
    helpers.confirmAuthentication,
    documentsController.fetchAll
  );
  // find the specified document
  app.get(
    '/api/v1/documents/:id',
    helpers.confirmAuthentication,
    documentsController.fetchOne
  );
  // update the specified documents attributes
  app.put(
    '/api/v1/documents/:id',
    helpers.confirmAuthentication,
    documentsController.update
  );
  // delete the specified document
  app.delete(
    '/api/v1/documents/:id',
    helpers.confirmAuthentication,
    documentsController.delete
  );
  // search for a document
  app.get(
    '/api/v1/search/documents/',
    helpers.confirmAuthentication,
    documentsController.search
  );
  // add a new role to the specified document
  app.post(
    '/api/v1/documents/:documentId',
    helpers.confirmAuthentication,
    documentsController.addUser
  );


  // ROLE END-POINTS

  // create a new role record
  app.post(
    '/api/v1/roles',
    helpers.confirmAuthentication,
    rolesController.create
  );
  // find all roles
  app.get(
    '/api/v1/roles',
    rolesController.list
  );

  // RIGHT END-POINTS

  // create a new right record
  app.post(
    '/api/v1/rights',
    helpers.confirmAuthentication,
    rightsController.create
  );
  // find all rights
  app.get(
    '/api/v1/rights',
    helpers.confirmAuthentication,
    rightsController.list
  );
};

export default index;
