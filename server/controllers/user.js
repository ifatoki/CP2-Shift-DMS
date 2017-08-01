const auth = require('../auth/_helpers');
const User = require('../models').User;
const Document = require('../models').Document;
const Role = require('../models').Role;
const localAuth = require('../auth/local');

const updateUser = (req, res, user) => {
  user.update({
    first_name: req.body.first_name || user.first_name,
    last_name: req.body.last_name || user.last_name,
    password: req.body.password || user.password,
    role_id: req.body.role_id || user.role_id,
  })
  .then(updatedUser => res.status(200).send(updatedUser))
  .catch(error => res.status(400).send(error));
};

module.exports = {
  create: (req, res) => {
    User
      .create({
        username: req.body.username,
        email_address: req.body.email,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        password: auth.encrypt(req.body.password),
        RoleId: req.body.roleId
      })
      .then((user) => {
        const token = localAuth.encodeToken({
          id: user.id,
          username: user.username
        });
        Role.findById(user.RoleId)
          .then((role) => {
            res.status(201).json({
              status: 'success',
              payload: {
                token,
                user,
                role: role.title
              }
            });
          });
      })
      .catch(error => res.status(400).send({
        status: 'error',
        message: error.message
      }));
  },
  login: (req, res) => {
    User
      .findOne({
        where: {
          $or: [
            { email_address: req.body.username },
            { username: req.body.username }
          ]
        }
      })
      .then((user) => {
        if (!user) throw new Error('user not found');
        auth.comparePassword(req.body.password, user.password);
        return user;
      })
      .then((user) => {
        const token = localAuth.encodeToken({
          id: user.id,
          username: user.username
        });
        Role.findById(user.RoleId)
          .then((role) => {
            res.status(200).jsonp({
              status: 'success',
              payload: {
                token,
                user,
                role: role.title
              }
            });
          });
      })
      .catch((err) => {
        let status = 500;
        if (err.message !== 'invalid password') {
          status = 401;
        }
        res.status(status).json({
          status: 'error',
          message: err.message
        });
      });
  },
  logout: (req, res) => {
    res.status(200).jsonp({
      status: 'success'
    });
  },
  fetch: (req, res) => {
    User
      .findAll({
        include: [{
          model: Document,
          as: 'myDocuments'
        }, {
          model: Document
        }],
        where: {
          RoleId: {
            $ne: 1
          }
        },
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
          Role.findById(user.RoleId)
            .then((role) => {
              res.status(200).send({
                user,
                role: role.title
              });
            });
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
          as: 'myDocuments'
        }, {
          model: Document
        }],
      })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else {
          res.status(200).send({
            authoredDocuments: user.myDocuments,
            sharedDocuments: user.Documents
          });
        }
      })
      .catch(error => res.status(400).send(error));
  },
  fetchPrivateDocuments(req, res) {
    Document
      .findAll({
        where: {
          AccessId: 1,
          OwnerId: req.params.id
        }
      })
      .then((documents) => {
        if (!documents) {
          res.status(404).send({
            message: 'user has no private documents'
          });
        } else {
          res.status(200).send(documents);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  updateUser: (req, res) => {
    if (req.roleId === 1 || req.userId === parseInt(req.params.id, 10)) {
      User
        .findById(req.params.id)
        .then((user) => {
          if (!user) {
            res.status(404).send({
              message: 'user not found'
            });
          } else {
            if (req.body.email) {
              User.find({
                where: {
                  $or: [{
                    email_address: req.body.email,
                  }, {
                    username: req.body.username
                  }]
                }
              })
              .then((conflictingUser) => {
                if (conflictingUser) {
                  res.status(403).send({
                    message: 'a user already has that email address or username'
                  });
                } else {
                  updateUser(req, res, user);
                }
              })
              .catch(error => res.status(400).send(error));
            }
            updateUser(req, res, user);
          }
        })
        .catch(error => res.status(400).send(error));
    } else {
      res.status(403).send({
        message: 'only overlord or a user can edit his details'
      });
    }
  },
  deleteUser: (req, res) => {
     // WHAT IS LEFT: Actual destruction of user with casdading
    if (req.roleId === 1) {
      if (req.params.id === '1') {
        res.status(403).send({
          message: 'you cannot delete the overlord'
        });
      } else {
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
      }
    } else {
      res.status(403).send({
        message: 'only overlord can delete user'
      });
    }
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
