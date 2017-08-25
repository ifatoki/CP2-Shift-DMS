import chai from 'chai';
import request from 'supertest';
import express from 'express';
import authHelpers from '../../auth/helpers';
import local from '../../auth/local';
import app from '../../app';

const expect = chai.expect;

describe('auth : helpers', () => {
  const password = 'Micheal';
  const aWrongPassword = 'Smith';
  describe('Encrypt Password', () => {
    it('should return a string as the encrypted password', () => {
      expect(authHelpers.encrypt(password)).to.be.a('string');
    });
    it(`show return null, when a null password or
    empty string is passed for encryption`,
    () => {
      expect(authHelpers.encrypt(null)).to.eql(null);
      expect(authHelpers.encrypt('')).to.eql(null);
    });
  });

  describe('Compare Password', () => {
    const encryptedPassword = authHelpers.encrypt(password);
    it(`should throw Error('invalid password') when a wrong passwords
    don't match`, () => {
      expect(() => authHelpers.comparePassword(aWrongPassword, password))
        .to.throw('invalid password');
    });
    it('should return TRUE when passwords match', () => {
      expect(authHelpers.comparePassword(password, encryptedPassword))
        .to.eql(true);
    });
  });

  describe('confirmAuthentication', () => {
    it(`should respond with json and status 200 and a welcome message
    when /api route is hit`,
    (done) => {
      request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.message).to.equal('Welcome to the Shift-DMS API!');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    const newApp = express();
    newApp.get('/home', authHelpers.confirmAuthentication, (req, res) => {
      res.send({
        status: 'successful'
      });
    });
    it(`should fail with status 401 and message 'please log login' when a
    protected route (/home) is hit by an unauthenticated user`,
    (done) => {
      request(newApp)
        .get('/home')
        .expect('Content-Type', /json/)
        .expect(401)
        .then((res) => {
          expect(res.body.status).to.equal('please log in');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    const headers = {
      authorization: process.env.INVALID_AUTH_TOKEN
    };
    it(`should fail with status 401 and message 'jwt malformed'
    when an invalid token is used`,
    (done) => {
      request(newApp)
        .get('/home')
        .set('authorization', headers.authorization)
        .expect(401)
        .then((res) => {
          expect(res.body.status).to.equal('jwt malformed');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    const expiredToken = local.encodeToken({
      id: 1,
      name: 'obama'
    }, true);
    it(`should fail with status 401 and message 'jwt expired'
    when an expired token is used`,
    (done) => {
      request(newApp)
        .get('/home')
        .set('authorization', `bearer ${expiredToken}`)
        .expect(401)
        .then((res) => {
          expect(res.body.status).to.equal('jwt expired');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});

