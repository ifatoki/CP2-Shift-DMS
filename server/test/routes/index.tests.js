import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import _ from 'lodash';
import local from '../../auth/local';
import app from '../../app';

const { Right, Role } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const overlordToken = local.encodeToken({
  id: 1,
  username: 'itunuworks'
});

const userToken = local.encodeToken({
  id: 2,
  username: 'auserhasnoname'
});

describe('routes : index', () => {
  describe('Endpoints: Right', () => {
    describe('GET /api/v1/rights route', () => {
      it('should return an array when queried', (done) => {
        request(app)
          .get('/api/v1/rights')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.array();
            expect(res.body).to.be.ofSize(3);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe('POST /api/v1/rights route', () => {
      after('Clean out the newly added right', () => {
        Right.destroy({
          where: {
            title: 'admin'
          },
          cascade: true,
          restartIdentity: true
        });
      });

      it('should return blank title', (done) => {
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

      it('should return already exists', (done) => {
        request(app)
          .post('/api/v1/rights')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: 'read',
            description: 'My awesome avatar'
          })
          .then((res) => {
            expect(res.status).to.equal(400);
            expect(res.body)
              .to.have.property('message')
              .which.equals('already exists');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('should return the right added', (done) => {
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
              .to.have.property('title')
              .which.equals('admin');
            expect(res.body)
              .to.have.property('description')
              .which.equals('can administer the document');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe('Endpoints: Role', () => {
    describe('GET /api/v1/roles route', () => {
      it('should return an array', (done) => {
        request(app)
          .get('/api/v1/roles')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.array();
            expect(res.body).to.be.ofSize(3);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should not return an object with id = 1', (done) => {
        request(app)
          .get('/api/v1/roles')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(_.map(res.body, role => role.id))
              .not.to.be.containing(1);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
    describe('POST /api/v1/roles route', () => {
      after('Clean out the newly added right', () => {
        Role.destroy({
          where: {
            title: 'fellow'
          },
          cascade: true,
          restartIdentity: true
        });
      });

      it('should throw a 401 error when user is not overlord', (done) => {
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
              .to.have.property('title')
              .which.equals('fellow');
            expect(res.body)
              .to.have.property('description')
              .which.equals('Hilarious folk');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });

  describe('Endpoints: User', () => {
    console.log('User');
  });

  describe('Endpoints: Document', () => {
    console.log('Document');
  });
});
