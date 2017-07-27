import bcrypt from 'bcryptjs';
import localAuth from './local';
import { User } from '../models';

const encrypt = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (userPassword, databasePassword) => {
  const match = bcrypt.compareSync(userPassword, databasePassword);
  if (!match) throw new Error('invalid password');
  else return true;
};

const confirmAuthentication = (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(401).json({
      status: 'please log in'
    });
  }
  // decode the token
  const header = req.headers.authorization.split(' ');
  const token = header[1];
  localAuth.decodeToken(token, (err, payload) => {
    let status;
    let statusMessage;
    if (err) {
      status = 401;
      statusMessage = err;
    } else {
      User
        .findById(parseInt(payload.sub.id, 10))
        .then((user) => {
          req.userId = user.id;
          req.roleId = user.RoleId;
          next();
        })
        .catch(() => {
          status = 500;
          statusMessage = 'error';
        });
    }
    if (status) {
      return res.status(status).json({
        status: statusMessage
      });
    }
  });
};

module.exports = {
  encrypt,
  comparePassword,
  confirmAuthentication
};
