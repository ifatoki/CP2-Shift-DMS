import chai from 'chai';
import request from 'supertest';
import express from 'express';
import authHelpers from '../../auth/_helpers';
import local from '../../auth/local';
import app from '../../app';
// process.env.NODE_ENV = 'test';

const expect = chai.expect;

describe('auth : _helpers', () => {
  describe('The placeholder test', () => {
    it('should pass the placeholder test', () => {
      expect(2 + 4).to.equal(6);
    });
  });

  const password = 'Micheal';
  const aWrongPassword = 'Smith';
  describe('Encrypt Password', () => {
    it('should return a string', () => {
      expect(authHelpers.encrypt(password)).to.be.a('string');
    });
  });

  describe('Compare Password', () => {
    const encryptedPassword = authHelpers.encrypt(password);
    it("should throw Error('invalid password')", () => {
      expect(() => authHelpers.comparePassword(aWrongPassword, password))
        .to.throw('invalid password');
    });
    it('should return TRUE', () => {
      expect(authHelpers.comparePassword(password, encryptedPassword)).to.be.true;
    });
  });

  describe('confirmAuthentication', () => {
    it('should respond with json and status 200', () =>
      request(app)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res =>
          expect(res.body.message).to.equal('Welcome to the Shift-DMS API!')
        )
    );

    const newApp = express();
    newApp.get('/home', authHelpers.confirmAuthentication, (req, res) => {
      res.send({
        status: 'successful'
      });
    });
    it("should fail with status 401 and message 'please log login'", () => {
      request(newApp)
        .get('/home')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(res =>
          expect(res.body.status).to.equal('please log in')
        );
    });

    const headers = {
      authorization: 'bearer 8239892adjlkjadf89983298flkdaj'
    };
    it("should fail with status 401 and message 'jwt malformed'", () => {
      request(newApp)
        .get('/home')
        .set('authorization', headers.authorization)
        .expect(401)
        .then(res =>
          expect(res.body.status).to.equal('jwt malformed')
        );
    });

    const expiredToken = local.encodeToken({
      id: 1,
      name: 'obama'
    }, true);
    it("should fail with status 401 and message 'jwt expired'", () => {
      request(newApp)
        .get('/home')
        .set('authorization', `bearer ${expiredToken}`)
        .expect(401)
        .then(res =>
          expect(res.body.status).to.equal('jwt expired')
        );
    });
  });
});

