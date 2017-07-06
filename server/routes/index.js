const auth = require('../auth/_helpers');
const usersController = require('../controllers').users;
const documentsController = require('../controllers').documents;
const rolesController = require('../controllers').roles;
const rightsController = require('../controllers').rights;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Shift-DMS API!',
  }));

  // USER END-POINTS

  // logs a user in
  app.post('/api/users/login', usersController.login);
  // creates a new user record
  app.post('/api/users', usersController.create);

  // From here on, middleware that confirms if a user is logged in.

  // logs a user out
  app.post(
    '/api/users/logout',
    auth.confirmAuthentication,
    usersController.logout
  );
  // find all users
  app.get(
    '/api/users/',
    auth.confirmAuthentication,
    usersController.fetch
  );
  // find user with the specified id
  app.get(
    '/api/users/:id',
    auth.confirmAuthentication,
    usersController.fetchUser
  );
  // update the user with the specified id's attributes
  app.put(
    '/api/users/:id',
    auth.confirmAuthentication,
    usersController.updateUser
  );
  // delete the specified user
  app.delete(
    '/api/users/:id',
    auth.confirmAuthentication,
    usersController.deleteUser
  );
  // find all the documents belonging to the specified user
  app.get(
    '/api/users/:id/documents',
    auth.confirmAuthentication,
    usersController.fetchUserDocuments
  );
  // search for user
  app.get(
    '/api/search/users/',
    auth.confirmAuthentication,
    usersController.search
  );


  // DOCUMENT END-POINTS

  // create a new document record
  app.post(
    '/api/documents',
    auth.confirmAuthentication,
    documentsController.create
  );
  // find all documents
  app.get('/api/documents/',
    auth.confirmAuthentication,
    documentsController.fetch
  );
  // find the specified document
  app.get(
    '/api/documents/:id',
    auth.confirmAuthentication,
    documentsController.fetchDocument
  );
  // update the specified documents attributes
  app.put(
    '/api/documents/:id',
    auth.confirmAuthentication,
    documentsController.updateDocument
  );
  // delete the specified document
  app.delete(
    '/api/documents/:id',
    auth.confirmAuthentication,
    documentsController.deleteDocument
  );
  // search for a document
  app.get(
    '/api/search/documents/',
    auth.confirmAuthentication,
    documentsController.search
  );
  // add a new role to the specified document
  app.post(
    '/api/documents/:documentId',
    auth.confirmAuthentication,
    documentsController.addUser
  );


  // ROLE END-POINTS

  // create a new role record
  app.post(
    '/api/roles',
    auth.confirmAuthentication,
    rolesController.create
  );
  // find all roles
  app.get(
    '/api/roles',
    auth.confirmAuthentication,
    rolesController.list
  );

  // RIGHT END-POINTS

  // create a new right record
  app.post(
    '/api/rights',
    auth.confirmAuthentication,
    rightsController.create
  );
  // find all rights
  app.get(
    '/api/rights',
    auth.confirmAuthentication,
    rightsController.list
  );
};
