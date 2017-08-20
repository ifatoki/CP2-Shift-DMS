import jwt from 'jsonwebtoken';
import moment from 'moment';
import UsersActions from '../actions/UsersActions';
import store from '../client';

const { addUser } = UsersActions;

/**
 * @export
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
    jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
      if (!error) {
        const now = moment().unix();

        // check if the token has expired
        if (now > payload.exp) callback('token has expired');
        else callback(null, payload);
      } else {
        callback(error);
      }
    });
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
