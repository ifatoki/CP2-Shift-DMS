const jwt = require('jsonwebtoken');
const moment = require('moment');

require('dotenv').config();

const Local = {
  /**
   * Encodes the passed user object in a token
   * @function encodeToken
   *
   * @param {Object} user - User Object with basic id and username
   * @param {boolean} test - True to generate token that expires in 2ms
   *
   * @returns {string} A token with encoded user details
   */
  encodeToken: (user, test) => {
    const payload = {
      exp: test ? moment().add(2, 'ms').unix() :
        moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
  },
  /**
   * Decodes a token to extract the content.
   * @function decodeToken
   *
   * @param {string} token - Token to be verified
   * @param {Callback} callback - Function callback on completion
   *
   * @returns {void}
   */
  decodeToken: (token, callback) => {
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      callback(null, payload);
    } catch (err) {
      callback(err.message);
    }
  }
};

export default Local;
