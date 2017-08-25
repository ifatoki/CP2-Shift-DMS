import bcrypt from 'bcryptjs';
import local from './local';
import { User } from '../models';

const helpers = {
  /**
   * @function encrypt
   *
   * @param {any} password
   * @returns {string|null} The encrypted password or null for an error
   */
  encrypt(password) {
    const salt = bcrypt.genSaltSync();
    if (password) {
      return bcrypt.hashSync(password, salt);
    }
    return null;
  },

  /**
   * @function comparePassword
   *
   * @param {any} userPassword
   * @param {any} databasePassword
   * @returns {true} when the passwords passed match
   * @throws {Error} when there is no match
   */
  comparePassword(userPassword, databasePassword) {
    try {
      const match = bcrypt.compareSync(userPassword, databasePassword);
      if (!match) throw new Error('invalid password');
      else return true;
    } catch (e) {
      throw new Error('invalid password');
    }
  },

  /**
   * @function confirmAuthentication
   *
   * @param {any} req
   * @param {any} res
   * @param {any} next
   * @returns {json} the response object
   */
  confirmAuthentication(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
      return res.status(401).json({
        status: 'please log in'
      });
    }
    // decode the token
    const header = req.headers.authorization.split(' ');
    const token = header[1];
    local.decodeToken(token, (err, payload) => {
      let status;
      let statusMessage;
      if (err) {
        status = 401;
        statusMessage = err;
      } else {
        User
          .findById(parseInt(payload.sub.id, 10))
          .then((user) => {
            if (user) {
              req.userId = user.id;
              req.roleId = user.roleId;
              next();
            } else {
              res.status(404).send({
                message: 'user not found'
              });
            }
          })
          .catch(() => {
            status = 500;
            statusMessage = 'error';
          });
      }
      if (status) {
        return res.status(status).send({
          status: statusMessage
        });
      }
    });
  }
};

export default helpers;
