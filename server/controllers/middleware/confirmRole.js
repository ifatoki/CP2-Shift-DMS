const User = require('../../models').User;

/**
 * Confirms if a user with the same username or email already exist and
 * returns a matching error or proceeds to the next block.
 * @function confirmUserDetails
 *
 * @param {Object} req - Server Request Object
 * @param {Object} res - Server Response Object
 * @param {requestCallback} next - Server Request Callback
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
 * Confirm if an Overlord role already exists.
 * If so, throw an error, else proceed with creating on.
 * @function confirmRole
 *
 * @export
 * @param {Object} req - Server Request Object
 * @param {Object} res - Server Response Object
 * @param {requestCallback} next - Server Request Callback
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
