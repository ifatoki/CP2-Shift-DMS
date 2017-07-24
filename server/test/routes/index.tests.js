import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import local from '../../auth/local';
import app from '../../app';

const Right = require('../../models').Right;

const expect = chai.expect;
chai.use(assertArrays);

const validToken = local.encodeToken({
  id: 1,
  username: 'itunuworks'
});

describe('routes : index', () => {
  describe('Endpoints: Right', () => {
    describe('GET /api/v1/rights route', () => {
      it('should return an array', (done) => {
        request(app)
          .get('/api/v1/rights')
          .set('authorization', `bearer ${validToken}`)
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
          .set('authorization', `bearer ${validToken}`)
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
          .set('authorization', `bearer ${validToken}`)
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
          .set('authorization', `bearer ${validToken}`)
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
    console.log('Role');
  });

  describe('Endpoints: User', () => {
    console.log('User');
  });

  describe('Endpoints: Document', () => {
    console.log('Document');
  });
});
