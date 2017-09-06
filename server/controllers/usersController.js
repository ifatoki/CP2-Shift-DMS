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
 * Confirms the role of the user.
 * @function confirmRole
 *
 * @param {Object} req - Server Request Object
 * @param {Object} user - A user object
 * @returns {void}
 */
const confirmRole = (req, user) => {
  if (req.body.roleId && req.body.roleId !== 1) {
    return Role
      .findById(req.body.roleId)
      .then((role) => {
        if (!role) {
          throw new Error('no match found for the passed roleId');
        } else {
          return user;
        }
      })
      .catch((error) => {
        if (error.message !== 'no match found for the passed roleId') {
          throw new Error('server error');
        }
        throw error;
      });
  }
  return new Promise((resolve, reject) => {
    if (req.body.roleId === 1) {
      reject(new Error('user cannot be upgraded to overlord. change role Id'));
    }
    resolve(user);
  });
};

/**
 * Update the user with the passed Id using the passed data
 * @function updateUser
 *
 * @param {Object} req - Server Request Object
 * @param {Object} res - Server Response Object
 * @param {Object} unConfirmedUser -  A user Object
 * @return {void}
 */
const updateUser = (req, res, unConfirmedUser) => {
  try {
    confirmRole(req, unConfirmedUser)
    .then((user) => {
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
      .catch(() => {
        throw new Error('server error');
      });
    })
    .catch(((error) => {
      const { message } = error;
      if (message === 'no match found for the passed roleId') {
        res.status(404).send({ message });
      } else {
        returnServerError(res);
      }
    }));
  } catch (error) {
    const { message } = error;
    if (message === 'no match found for the passed roleId') {
      res.status(404).send({ message });
    } else if (
      message === 'user cannot be upgraded to overlord. change role Id'
    ) {
      res.status(409).send({ message });
    } else {
      returnServerError(res);
    }
  }
};

/**
 * Return a 404 error and send a document not found error message
 * @function returnUserNotFound
 *
 * @param {Object} res - Server Response Object
 * @return {void}
 */
const returnUserNotFound = res => (
  res.status(404).send({
    message: 'user not found'
  })
);

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
    const {
      username, email, firstname, lastname, password, confirmPassword, roleId
    } = req.body;
    const userData = {
      username,
      email,
      firstname,
      lastname,
      password,
      confirmPassword,
      roleId
    };

    const validation = Validator.validateSignUp(userData);
    if (validation.isValid) {
      Role.findById(roleId)
      .then((role) => {
        if (role) {
          User
            .create({
              username,
              email,
              firstname,
              lastname,
              roleId,
              password: auth.encrypt(password),
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
            returnUserNotFound(res);
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
            returnUserNotFound(res);
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
    const {
      username,
      firstname,
      lastname,
      newPassword,
      currentPassword,
      confirmPassword,
      roleId,
      email
    } = req.body;

    const userData = {
      username,
      firstname,
      lastname,
      newPassword,
      currentPassword,
      confirmPassword,
      roleId,
      email
    };
    const validation = Validator.validateUserEdit(userData);
    if (validation.isValid) {
      if (req.userId === parseInt(req.params.id, 10)) {
        User
          .findById(req.params.id)
          .then((user) => {
            if (!user) {
              returnUserNotFound(res);
            } else {
              if (userData.newPassword) {
                auth.comparePassword(
                  userData.currentPassword, user.password
                );
              }
              if (userData.email || userData.username) {
                User.find({
                  where: {
                    $or: [
                      { email }, { username }
                    ]
                  }
                })
                .then((conflictingUser) => {
                  if (conflictingUser) {
                    res.status(409).send({
                      message:
                        'a user already has that email address or username'
                    });
                  } else {
                    updateUser(req, res, user);
                  }
                })
                .catch(() => returnServerError(res));
              } else {
                updateUser(req, res, user);
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
              returnUserNotFound(res);
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
    const query = req.query.q;
    User
    .findAll({
      where: {
        $or: [{
          username: {
            $ilike: `%${query}%`
          }
        }, {
          email: {
            $ilike: `%${query}%`
          }
        }, {
          firstname: {
            $ilike: `%${query}%`
          }
        }, {
          lastname: {
            $ilike: `%${query}%`
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
