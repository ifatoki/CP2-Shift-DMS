import _ from 'lodash';
import Validator from '../utils/Validator';

const auth = require('../auth/helpers');
const User = require('../models').User;
const Role = require('../models').Role;
const localAuth = require('../auth/local');

const filterUser = ({
  id, username, email, firstname, lastname, roleId, createdAt
}) => {
  return {
    id,
    username,
    firstname,
    lastname,
    email,
    roleId,
    createdAt
  };
};

const getValidatorErrorMessage = (errors) => {
  return _.reduce(errors, (result, error) => {
    return `${error}\n${result}`;
  }, '');
};

const updateUser = (req, res, user) => {
  user.update({
    username: req.body.username || user.username,
    firstname: req.body.firstname || user.firstname,
    lastname: req.body.lastname || user.lastname,
    password: auth.encrypt(req.body.newPassword) || user.password,
    roleId: req.body.roleId || user.roleId,
    email: req.body.email || user.email
  })
  .then((updatedUser) => {
    Role.findById(updatedUser.roleId)
      .then((role) => {
        const returnedUser = filterUser(user);

        returnedUser.role = role.title;
        res.status(200).send({
          user: returnedUser
        });
      });
  })
  .catch(error => res.status(500).send({
    message: error.message
  }));
};

const confirmRole = (req, res, user) => {
  if (req.body.roleId && req.body.roleId !== 1) {
    Role
      .findById(req.body.roleId)
      .then((role) => {
        if (!role) {
          res.status(404).send({
            message: 'no match found for the passed roleId'
          });
        } else {
          updateUser(req, res, user);
        }
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
  } else if (req.body.roleId === 1) {
    res.status(403).send({
      message: 'user cannot be upgraded to overlord. change role Id'
    });
  } else {
    updateUser(req, res, user);
  }
};

module.exports = {
  create: (req, res) => {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      newPassword: auth.encrypt(req.body.password),
      roleId: req.body.roleId
    };

    const validation = Validator.validateNewDocument(userData);
    if (validation.isValid) {
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
                token,
                user: returnedUser
              });
            })
            .catch(error => res.status(400).send({
              message: error.message
            }));
        } else {
          res.status(404).send({
            message: "user role doesn't exist"
          });
        }
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
    } else {
      res.status(400).send({
        message: getValidatorErrorMessage(validation.errors)
      });
    }
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
              token,
              user: returnedUser
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
    if (req.roleId === 1) {
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
            const filteredUsers = _.reduce(users, (accumulator, user) => {
              return accumulator.concat(filterUser(user));
            }, []);
            res.status(200).send({
              users: filteredUsers
            });
          }
        })
        .catch(error => res.status(400).send({
          message: error.message
        }));
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
              res.status(200).send({
                user: returnedUser
              });
            });
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
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
              res.status(200).send({
                documents
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: error.message
              });
            });
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  },
  updateUser: (req, res) => {
    const userData = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      newPassword: req.body.newPassword,
      currentPassword: req.body.currentPassword,
      confirmPassword: req.body.confirmPassword,
      roleId: req.body.roleId,
      email: req.body.email
    };
    const validation = Validator.validateUserEdit(userData);
    if (validation.isValid) {
      if (req.userId === parseInt(req.params.id, 10)) {
        User
          .findById(req.params.id)
          .then((user) => {
            if (!user) {
              res.status(404).send({
                message: 'user not found'
              });
            } else {
              if (userData.newPassword) {
                auth.comparePassword(
                  userData.currentPassword, user.password
                );
              }
              if (userData.email || userData.username) {
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
                      message:
                        'a user already has that email address or username'
                    });
                  } else {
                    confirmRole(req, res, user);
                  }
                })
                .catch(error => res.status(500).send({
                  message: error.message
                }));
              } else {
                confirmRole(req, res, user);
              }
            }
          })
          .catch((error) => {
            let status = 500;
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
    } else {
      res.status(400).send({
        message: getValidatorErrorMessage(validation.errors)
      });
    }
  },
  deleteUser: (req, res) => {
    if (req.roleId === 1) {
      if (parseInt(req.params.id, 10) === 1) {
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
              .catch(error => res.status(400).send({
                message: error.message
              }));
            }
          })
          .catch(error => res.status(400).send({
            message: error.message
          }));
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
        }],
        roleId: {
          $ne: 1
        }
      },
      attributes: [
        'id', 'firstname', 'lastname', 'username', 'email', 'roleId'
      ]
    })
    .then(users => res.status(200).send({ users }))
    .catch(error => res.status(400).send({
      message: error.message
    }));
  }
};
