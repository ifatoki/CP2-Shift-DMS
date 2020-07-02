import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import app from '../../app';
import Tokens from '../helpers/Tokens';

const { Right } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const { overlordToken } = Tokens;

describe('Right Controllers:', () => {
  describe('Endpoints: Right', () => {
    describe('GET route', () => {
      it(`should return an array of rights when queried in its 
      initial raw state`, (done) => {
        request(app)
          .get('/api/v1/rights')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.a.property('rights');
            expect(res.body.rights).to.be.array().ofSize(3);
            expect(res.body.rights[0]).to.have.property('title', 'edit');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe('POST route', () => {
      after('Clean out the newly added right', () => {
        Right.destroy({
          where: {
            title: 'admin'
          },
          cascade: true,
          restartIdentity: true
        });
      });
      it('should return 400 error when a blank title is supplied', (done) => {
        request(app)
          .post('/api/v1/rights')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: '',
            description: 'My awesome avatar'
          })
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body)
              .to.have.property('message')
              .which.equals('blank title');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it(`should return 409 error when a right with the 
      same title already exists`, (done) => {
        request(app)
          .post('/api/v1/rights')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: 'read',
            description: 'My awesome avatar'
          })
          .then((res) => {
            expect(res.status).to.equal(409);
            expect(res.body)
              .to.have.property('message')
              .which.equals('right already exists');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return 201 with the right added when a new right is created',
      (done) => {
        request(app)
          .post('/api/v1/rights')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: 'admin',
            description: 'can administer the document'
          })
          .then((res) => {
            expect(res.status).to.equal(201);
            expect(res.body)
              .to.have.property('right')
              .which.has.property('title')
              .which.equals('admin');
            expect(res.body)
              .to.have.property('right')
              .which.has.property('description')
              .which.equals('can administer the document');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
