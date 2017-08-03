const jwt = require('jsonwebtoken');
const moment = require('moment');

require('dotenv').config();

module.exports = {
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
  decodeToken: (token, callback) => {
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      callback(null, payload);
    } catch (err) {
      callback(err.message);
    }
  }
};
