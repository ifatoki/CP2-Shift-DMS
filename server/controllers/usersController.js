import lodash from 'lodash';
import Validator from '../utils/Validator';
import auth from '../auth/helpers';
import local from '../auth/local';
import { User, Role } from '../models';

/**
 * Returns a 500 server error with the server response
 * @function returnServerError
 *
 * @param {Object} res - Server Response Object
 * @returns {void}
 */
const returnServerError = res => (
  res.status(500).send({
    message: 'oops, we just encountered an error. please try again'
  })
);

/**
 * Filter out protected user details
 * @function filterUser
 *
 * @param {Object} User - A User Object
 * @returns {Object} A filtered user object
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
 * Create an error message from an error object
 * @function getValidatorErrorMessage
 *
 * @param {Object} errors - An errors Object
 * @returns {string} A summary of all errors
 */
const getValidatorErrorMessage = errors => (
  lodash.reduce(errors, (result, error) =>
    `${error}\n${result}`
  , '')
);

/**
 * Update the user with the passed Id using the passed data
 * @function updateUser
 *
 * @param {Object} req - Server Request Object
 * @param {Object} res - Server Response Object
 * @param {Object} user -  A user Object
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
 * Confirms the role of the user.
 * @function confirmRole
 *
 * @param {Object} req - Server Request Object
 * @param {Object} res - Server Response Object
 * @param {Object} user - A user object
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

const usersController = {
  /**
   * Create a new user using passed data
   * @function create
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
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
              const token = local.encodeToken({
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
   * Log in with the passed details.
   * @function login
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
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
        const token = local.encodeToken({
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
   * Log user out.
   * @function logout
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  logout: (req, res) => {
    res.status(200).send({
      message: 'user signed out'
    });
  },

  /**
   * Fetch and return all available users.
   * @function fetch
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  fetchAll: (req, res) => {
    if (req.roleId === 1) {
      User
        .findAll({
          where: {
            roleId: {
              $ne: 1
            }
          },
          offset: req.query.offset || null,
          limit: req.query.limit || null
        })
        .then((users) => {
          if (!users) {
            res.status(404).send({
              message: 'no users in database'
            });
          } else {
            const filteredUsers = lodash.reduce(users, (accumulator, user) =>
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
   * Fetch and return the user with the passed id
   * @function fetchUser
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  fetchOne: (req, res) => {
    if (!isNaN(parseInt(req.params.id, 10))) {
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
    } else {
      res.status(400).send({
        message: 'id must be an integer'
      });
    }
  },

  /**
   * Fetch all documents for the user with the passed id
   * @function fetchUserDocuments
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  fetchUserDocuments(req, res) {
    if (!isNaN(parseInt(req.params.id, 10))) {
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
    } else {
      res.status(400).send({
        message: 'id must be an integer'
      });
    }
  },

  /**
   * Update the user with the passed Id using the passed data
   * @function updateUser
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
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
   * Delete the user with the passed id
   * @function deleteUser
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  deleteUser: (req, res) => {
    if (req.roleId === 1) {
      if (parseInt(req.params.id, 10) === 1) {
        res.status(403).send({
          message: 'you cannot delete the overlord'
        });
      } else if (!isNaN(parseInt(req.params.id, 10))) {
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
      } else {
        res.status(400).send({
          message: 'id must be an integer'
        });
      }
    } else {
      res.status(403).send({
        message: 'only overlord can delete user'
      });
    }
  },

  /**
   * Search through all users with the search query string
   * @function search
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
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

export default usersController;
