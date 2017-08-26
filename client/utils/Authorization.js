import jwt from 'jsonwebtoken';
import moment from 'moment';
import usersActions from '../actions/usersActions';
import store from '../client';

const { addUser } = usersActions;

/**
 * A class that handles part of
 * the authentication needs of the application
 * @export Authorization
 * @class Authorization
 */
export default class Authorization {
  /**
   * @method decodeToken
   *
   * @static
   * @param {any} token
   * @param {any} callback
   * @memberof Authorization
   * @returns {void}
   */
  static decodeToken(token, callback) {
    const payload = jwt.decode(token);

    if (payload) {
      const now = moment().unix();

      if (now > payload.exp) {
        callback('token has expired');
      } else {
        callback(null, payload);
      }
    } else {
      throw new Error('invalid token');
    }
  }

  /**
   * @method setUser
   *
   * @static
   * @param {any} user
   * @param {any} token
   * @memberof Authorization
   * @returns {void}
   */
  static setUser(user, token) {
    window.localStorage.setItem('user', user);
    addUser(user, token, (action) => {
      store.dispatch(action);
    });
  }
}
