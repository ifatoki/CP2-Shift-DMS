const jwt = require('jsonwebtoken');
const moment = require('moment');

require('dotenv').config();

module.exports = {
  encodeToken: (user) => {
    const payload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
  },
  decodeToken: (token, callback) => {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const now = moment().unix();

    // check if the token has expired
    if (now > payload.exp) callback('token has expired.');
    else callback(null, payload);
  }
};
