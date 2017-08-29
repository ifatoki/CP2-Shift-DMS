import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import lodash from 'lodash';
import app from '../../app';
import tokens from '../helpers/tokens';

const { Role } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const { overlordToken, userToken } = tokens;

describe('Role Controllers:', () => {
  describe('Endpoints: Role', () => {
    describe('GET route', () => {
      it(`should return an object with a property roles which is an 
      array on success`, (done) => {
        request(app)
          .get('/api/v1/roles')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body)
              .to.have.property('roles')
              .which.is.array().ofSize(3);
            expect(res.body.roles[0]).to.have.property('title', 'admin');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should not return a role with id = 1 (overlord) when queried',
      (done) => {
        request(app)
          .get('/api/v1/roles')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(lodash.map(res.body.roles, role => role.id))
              .not.to.be.containing(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe('POST route', () => {
      after('Clean out the newly added right', () => {
        Role.destroy({
          where: {
            title: 'fellow'
          },
          cascade: true,
          restartIdentity: true
        });
      });
      it(`should throw a 401 error when user is not overlord and he tries
      creating a role`, (done) => {
        request(app)
          .post('/api/v1/roles')
          .type('form')
          .set('authorization', `bearer ${userToken}`)
          .send({
            title: 'fellow',
            description: 'Hilarious folk'
          })
          .then((res) => {
            expect(res.status).to.equal(401);
            expect(res.body)
              .to.have.property('message')
              .which.equals('you are not authorized to create new roles');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return the new role when user is overlord', (done) => {
        request(app)
          .post('/api/v1/roles')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: 'fellow',
            description: 'Hilarious folk'
          })
          .then((res) => {
            expect(res.status).to.equal(201);
            expect(res.body)
              .to.have.property('role')
              .which.has.property('title')
              .which.equals('fellow');
            expect(res.body)
              .to.have.property('role')
              .which.has.property('description')
              .which.equals('Hilarious folk');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
