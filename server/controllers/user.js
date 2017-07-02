const User = require('../models').User;
const Document = require('../models').Document;

module.exports = {
  create: (req, res) => {
    User
      .create({
        username: req.body.username,
        email_address: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        RoleId: req.body.role_id
      })
      .then(user => res.status(201).send({
        status: 'success',
        user
      }))
      .catch(error => res.status(400).send({
        status: 'error',
        message: error.message
      }));
  },
  login: (req, res) => {
    res.status(200).jsonp({
      message: 'Now I will log you in'
    });
  },
  logout: (req, res) => {
    res.status(201).jsonp({ message: 'I am the logout',
      params: req.params,
      queries: req.query
    });
  },
  fetch: (req, res) => {
    User
      .findAll({
        include: [{
          model: Document,
          as: 'userDocuments'
        }],
        offset: req.query.offset,
        limit: req.query.limit || null
      })
      .then((users) => {
        if (!users) {
          res.status(404).send({
            message: 'no users in database'
          });
        } else {
          res.status(200).send(users);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  fetchUser: (req, res) => {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else {
          res.status(200).send(user);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  fetchUserDocuments(req, res) {
    User
      .findOne({
        where: {
          id: req.params.id
        },
        include: [{
          model: Document,
          as: 'userDocuments',
        }]
      })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else {
          res.status(201).send(user.userDocuments);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  updateUser: (req, res) => {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else {
          user.update({
            first_name: req.body.first_name || user.first_name,
            last_name: req.body.last_name || user.last_name,
            password: req.body.password || user.password,
            role_id: req.body.role_id || user.rode_id,
          })
          .then(updatedUser => res.status(200).send(updatedUser))
          .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(400).send(error));
  },
  deleteUser: (req, res) => {
    User
      .findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else {
          user.destroy({
            cascade: true
          })
          .then(() => res.status(200).send({
            message: 'user deleted successfully'
          }))
          .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(400).send(error));
  },
  search: (req, res) => {
    User
      .findAll({
        where: {
          $or: [{
            username: {
              $ilike: `${req.query.q}%`
            }
          }, {
            email_address: {
              $ilike: `${req.query.q}%`
            }
          }]
        }
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  }
};
