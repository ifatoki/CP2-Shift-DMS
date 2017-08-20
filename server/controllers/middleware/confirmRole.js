const User = require('../../models').User;

/**
 * @function confirmUserDetails
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 * @throws {Error}
 */
function confirmUserDetails(req, res, next) {
  User
    .findOne({
      where: {
        $or: [{
          username: req.body.username
        }, {
          email: req.body.email
        }]
      }
    })
    .then((user) => {
      if (user) {
        throw new Error(
          'a user with that email or username already exists'
        );
      } else {
        next();
      }
    })
    .catch((error) => {
      res.status(403).send({
        message: error.message
      });
    });
}

/**
 * @function confirmRole
 *
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {void}
 */
export default function confirmRole(req, res, next) {
  if (parseInt(req.body.roleId, 10) === 1) {
    User
      .findOne({
        where: {
          roleId: req.body.roleId
        }
      })
      .then((overlord) => {
        if (overlord) {
          throw new Error('overlord already exists');
        } else {
          confirmUserDetails(req, res, next);
        }
      })
      .catch((error) => {
        res.status(403).send({
          message: error.message
        });
      });
  } else {
    confirmUserDetails(req, res, next);
  }
}
