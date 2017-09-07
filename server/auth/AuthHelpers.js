import bcrypt from 'bcryptjs';
import Local from './Local';
import { User } from '../models';

const AuthHelpers = {
  /**
   * Encrypts a password and returns the new encrypted one.
   * @function encrypt
   *
   * @param {string} password - Password to be encrypted
   *
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
   * Compares a password and an encrypted one to
   * see if they match when decrypted.
   * @function comparePassword
   *
   * @param {string} userPassword - Password entered by user
   * @param {string} databasePassword - Hashed password from database
   *
   * @returns {true} when the passwords passed match
   *
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
   * Confirms using the header and token, if the user is authenticated.
   * @function confirmAuthentication
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @param {ResponseCallback} next - Server Middleware Callback
   *
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
    Local.decodeToken(token, (err, payload) => {
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

export default AuthHelpers;
