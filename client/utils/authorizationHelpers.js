import jwt from 'jsonwebtoken';
import moment from 'moment';
import { addUser } from '../actions/users';

export default{
  decodeToken: (token, callback) => {
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
  },
  setUser: (user, token) => {
    window.localStorage.setItem('user', user);
    addUser(user, token);
  }
};
