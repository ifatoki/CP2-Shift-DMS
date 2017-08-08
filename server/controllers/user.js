const auth = require('../auth/_helpers');
const User = require('../models').User;
const Role = require('../models').Role;
const localAuth = require('../auth/local');
const authHelpers = require('../auth/_helpers');

const filterUser = (user) => {
  const { id, username, email, firstname, lastname, roleId } = user;
  return ({
    id,
    username,
    firstname,
    lastname,
    email,
    roleId
  });
};
const updateUser = (req, res, user) => {
  user.update({
    username: req.body.username || user.username,
    firstname: req.body.firstname || user.firstname,
    lastname: req.body.lastname || user.lastname,
    password: authHelpers.encrypt(req.body.newPassword) || user.password,
    roleId: req.body.roleId || user.roleId,
    email: req.body.email || user.email
  })
  .then((updatedUser) => {
    Role.findById(updatedUser.roleId)
      .then((role) => {
        const returnedUser = filterUser(user);

        returnedUser.role = role.title;
        res.status(200).send(returnedUser);
      });
  })
  .catch(error => res.status(500).send(error));
};

module.exports = {
  create: (req, res) => {
    Role.findById(req.body.roleId)
      .then((role) => {
        if (role) {
          User
            .create({
              username: req.body.username,
              email: req.body.email,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              password: auth.encrypt(req.body.password),
              roleId: req.body.roleId
            })
            .then((user) => {
              const token = localAuth.encodeToken({
                id: user.id,
                username: user.username
              });
              const returnedUser = filterUser(user);
              returnedUser.role = role.title;
              res.status(201).send({
                status: 'success',
                payload: {
                  token,
                  user: returnedUser
                }
              });
            })
            .catch(error => res.status(400).send({
              status: 'error',
              message: error.message
            }));
        } else {
          res.status(404).send({
            message: "role doesn't exist"
          });
        }
      })
      .catch(error => res.status(500).send(error.message));
  },
  login: (req, res) => {
    User
      .findOne({
        where: {
          $or: [
            { email: req.body.username },
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
        Role.findById(user.roleId)
          .then((role) => {
            const returnedUser = filterUser(user);
            returnedUser.role = role.title;
            res.status(200).send({
              payload: {
                token,
                user: returnedUser
              }
            });
          });
      })
      .catch((err) => {
        let status = 500;
        if (err.message === 'invalid password') {
          status = 401;
        } else if (err.message === 'user not found') {
          status = 404;
        }
        res.status(status).send({
          message: err.message
        });
      });
  },
  logout: (req, res) => {
    res.status(200).send({
      message: 'user signed out'
    });
  },
  fetch: (req, res) => {
    if (req.userId === 1) {
      User
        .findAll({
          where: {
            roleId: {
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
    } else {
      res.status(403).send({
        message: 'only overlord can view all users'
      });
    }
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
          Role.findById(user.roleId)
            .then((role) => {
              const returnedUser = filterUser(user);

              returnedUser.role = role.title;
              res.status(200).send(returnedUser);
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
      })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'user not found'
          });
        } else if (parseInt(req.params.id, 10) !== req.userId) {
          res.status(403).send({
            message: "you can't fetch another users documents"
          });
        } else {
          user.getMyDocuments()
            .then((documents) => {
              res.status(200).send(
                documents
              );
            })
            .catch((error) => {
              res.status(500).send({
                message: error.message
              });
            });
        }
      })
      .catch(error => res.status(400).send(error));
  },
  updateUser: (req, res) => {
    if (req.userId === parseInt(req.params.id, 10)) {
      User
        .findById(req.params.id)
        .then((user) => {
          if (!user) {
            res.status(404).send({
              message: 'user not found'
            });
          } else {
            if (req.body.newPassword) {
              authHelpers.comparePassword(
                req.body.currentPassword, user.password
              );
            }
            if (req.body.email || req.body.username) {
              User.find({
                where: {
                  $or: [{
                    email: req.body.email,
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
              .catch(error => res.status(400).send({
                message: error.message
              }));
            } else {
              updateUser(req, res, user);
            }
          }
        })
        .catch((error) => {
          let status = 400;
          if (error.message === 'invalid password') {
            status = 403;
          }
          res.status(status).send({
            message: error.message
          });
        });
    } else {
      res.status(403).send({
        message: 'only a user can edit his details'
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
            $ilike: `%${req.query.q}%`
          }
        }, {
          email: {
            $ilike: `%${req.query.q}%`
          }
        }, {
          firstname: {
            $ilike: `%${req.query.q}%`
          }
        }, {
          lastname: {
            $ilike: `%${req.query.q}%`
          }
        }]
      }
    })
    .then(users => res.status(200).send(users))
    .catch(error => res.status(400).send(error));
  }
};
