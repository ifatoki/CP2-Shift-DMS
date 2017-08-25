import _ from 'lodash';
import Validator from '../utils/Validator';

const auth = require('../auth/helpers');
const User = require('../models').User;
const Role = require('../models').Role;
const localAuth = require('../auth/local');

/**
 * Returns a 500 server error with the server response
 * @function returnServerError
 *
 * @param {any} res
 * @returns {void}
 */
const returnServerError = res => (
  res.status(500).send({
    message: 'oops, we just encountered an error. please try again'
  })
);

/**
 * @function filterUser
 *
 * @param {any} User
 * @returns {any} A filtered user object
 */
const filterUser = ({
  id, username, email, firstname, lastname, roleId, createdAt
}) => ({
  id,
  username,
  firstname,
  lastname,
  email,
  roleId,
  createdAt
});

/**
 * @function getValidatorErrorMessage
 *
 * @param {any} errors
 * @returns {string} A summary of all errors
 */
const getValidatorErrorMessage = errors => (
  _.reduce(errors, (result, error) =>
    `${error}\n${result}`
  , '')
);

/**
 * @function updateUser
 *
 * @param {any} req
 * @param {any} res
 * @param {any} user
 * @return {void}
 */
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
  .catch(() => returnServerError(res));
};

/**
 * @function confirmRole
 *
 * @param {any} req
 * @param {any} res
 * @param {any} user
 * @returns {void}
 */
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
      .catch(() => returnServerError(res));
  } else if (req.body.roleId === 1) {
    res.status(403).send({
      message: 'user cannot be upgraded to overlord. change role Id'
    });
  } else {
    updateUser(req, res, user);
  }
};

module.exports = {
  /**
   * @function create
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  create: (req, res) => {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      roleId: req.body.roleId
    };

    const validation = Validator.validateSignUp(userData);
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
            .catch(() => returnServerError(res));
        } else {
          res.status(404).send({
            message: "role with passed roleId doesn't exist. change roleId"
          });
        }
      })
      .catch(() => returnServerError(res));
    } else {
      res.status(400).send({
        message: getValidatorErrorMessage(validation.errors)
      });
    }
  },

  /**
   * @function login
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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

  /**
   * @function logout
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  logout: (req, res) => {
    res.status(200).send({
      message: 'user signed out'
    });
  },

  /**
   * @function fetch
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
            const filteredUsers = _.reduce(users, (accumulator, user) =>
              accumulator.concat(filterUser(user))
            , []);
            res.status(200).send({
              users: filteredUsers
            });
          }
        })
        .catch(() => returnServerError(res));
    } else {
      res.status(403).send({
        message: 'only overlord can view all users'
      });
    }
  },

  /**
   * @function fetchUser
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
              if (role) {
                returnedUser.role = role.title;
              }
              res.status(200).send({
                user: returnedUser
              });
            })
            .catch(() => returnServerError(res));
        }
      })
      .catch(() => returnServerError(res));
  },

  /**
   * @function fetchUserDocuments
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
            .catch(() => returnServerError(res));
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  },

  /**
   * @function updateUser
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
                .catch(() => returnServerError(res));
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

  /**
   * @function deleteUser
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
              .catch(() => returnServerError(res));
            }
          })
          .catch(() => returnServerError(res));
      }
    } else {
      res.status(403).send({
        message: 'only overlord can delete user'
      });
    }
  },

  /**
   * @function search
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
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
    .catch(() => returnServerError(res));
  }
};
