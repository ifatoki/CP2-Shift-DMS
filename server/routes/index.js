const auth = require('../auth/_helpers');
const usersController = require('../controllers').users;
const documentsController = require('../controllers').documents;
const rolesController = require('../controllers').roles;
const rightsController = require('../controllers').rights;

module.exports = (app) => {
  app.use((req, res, next) => {
    console.log('Now you knonw I am here');
    next();
  });
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Shift-DMS API!',
  }));

  // USER END-POINTS

  // logs a user in
  app.post('/api/users/login', usersController.login);
  // creates a new user record
  app.post('/api/users', usersController.create);

  // Middleware that confirms if a user is logged in.
  app.use((req, res, next) => {
    console.log('I would now validate your authentication.');
    auth.confirmAuthentication(req, res, next);
  });

  // logs a user out
  app.post('/api/users/logout', usersController.logout);
  // find all users
  app.get('/api/users/', usersController.fetch);
  // find user with the specified id
  app.get('/api/users/:id', usersController.fetchUser);
  // update the user with the specified id's attributes
  app.put('/api/users/:id', usersController.updateUser);
  // delete the specified user
  app.delete('/api/users/:id', usersController.deleteUser);
  // find all the documents belonging to the specified user
  app.get('/api/users/:id/documents', usersController.fetchUserDocuments);
  // search for user
  app.get('/api/search/users/', usersController.search);


  // DOCUMENT END-POINTS

  // create a new document record
  app.post('/api/documents', documentsController.create);
  // find all documents
  app.get('/api/documents/', documentsController.fetch);
  // find the specified document
  app.get('/api/documents/:id', documentsController.fetchDocument);
  // update the specified documents attributes
  app.put('/api/documents/:id', documentsController.updateDocument);
  // delete the specified document
  app.delete('/api/documents/:id', documentsController.deleteDocument);
  // search for a document
  app.get('/api/search/documents/', documentsController.search);
  // add a new role to the specified document
  app.post('/api/documents/:documentId', documentsController.addUser);


  // ROLE END-POINTS

  // create a new role record
  app.post('/api/roles', rolesController.create);
  // find all roles
  app.get('/api/roles', rolesController.list);

  // RIGHT END-POINTS

  // create a new right record
  app.post('/api/rights', rightsController.create);
  // find all rights
  app.get('/api/rights', rightsController.list);

  // DOCUMENTS_ROLES END-POINTS

  // add a new role to the specified document
  // app.post('/api/documentsroles/:document_id',
  //   documentsRolesController.addRole
  // );
};
