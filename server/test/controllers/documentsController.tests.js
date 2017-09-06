import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import faker from 'faker';
import app from '../../app';
import Tokens from '../helpers/Tokens';

const { User, Document } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const { overlordToken, userToken, nonExistingUserToken } = Tokens;

describe('Document Controllers :', () => {
  describe('Endpoints: Document', () => {
    const privateDoc1 = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(2),
      accessId: 1
    };
    const publicDoc1 = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(2),
      accessId: 2
    };
    const sharedDoc1 = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraphs(2),
      accessId: 3
    };

    after('Clean out the newly added documents', () => {
      Document.destroy({
        where: {
          title: [
            privateDoc1.title,
            publicDoc1.title,
            sharedDoc1.title
          ]
        },
        cascade: true,
        restartIdentity: true
      });
    });

    describe('POST route', () => {
      describe('POST /api/v1/documents route', () => {
        it(`should create and return new document when all 
        requirements are met`, (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(privateDoc1)
            .expect(201)
            .then((res) => {
              expect(res.body)
                .to.have.property('document')
                .which.has.property('title')
                .which.equals(privateDoc1.title);
              expect(res.body)
                .to.have.property('document')
                .which.has.property('content')
                .which.equals(privateDoc1.content);
              expect(res.body)
                .to.have.property('document')
                .which.does.not.have.property('createdAt');
              done();
            })
            .catch(err => done(err));
        });
        it(`should create and return new document when all 
        requirements are met`, (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${overlordToken}`)
            .type('form')
            .send(publicDoc1)
            .expect(201)
            .then((res) => {
              expect(res.body)
                .to.have.property('document')
                .which.has.property('title')
                .which.equals(publicDoc1.title);
              expect(res.body)
                .to.have.property('document')
                .which.has.property('content')
                .which.equals(publicDoc1.content);
              expect(res.body)
                .to.have.property('document')
                .which.does.not.have.property('createdAt');
              done();
            })
            .catch(err => done(err));
        });
        it(`should create and return new document when
        all requirements are met`, (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(sharedDoc1)
            .expect(201)
            .then((res) => {
              expect(res.body)
                .to.have.property('document')
                .which.has.property('title')
                .which.equals(sharedDoc1.title);
              expect(res.body)
                .to.have.property('document')
                .which.has.property('content')
                .which.equals(sharedDoc1.content);
              expect(res.body)
                .to.have.property('document')
                .which.has.property('updatedAt');
              done();
            })
            .catch(err => done(err));
        });
        it('should return error 409 when title already exists', (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(privateDoc1)
            .expect(409)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('a document with that title already exists');
              done();
            })
            .catch(err => done(err));
        });
        it('should return error 409 when title already exists', (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(privateDoc1)
            .expect(409)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('a document with that title already exists');
              done();
            })
            .catch(err => done(err));
        });
      });
    });

    describe('GET route', () => {
      describe('GET /api/v1/documents/ route', () => {
        it(`should return an object with property documents which is an array
        when query is successful`, (done) => {
          request(app)
            .get('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .query({ type: 'public' })
            .then((res) => {
              expect(res.body)
                .to.have.property('documents')
                .to.be.array();
              done();
            })
            .catch(err => done(err));
        });
        it(`should return an object with property documents which is an array
        when query is successful`, (done) => {
          request(app)
            .get('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .then((res) => {
              expect(res.body)
                .to.have.property('documents')
                .to.be.array();
              done();
            })
            .catch(err => done(err));
        });
        it(`should return an object with property documents which is
        an array of documents when query is successful`, (done) => {
          request(app)
            .get('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .query({ type: 'role' })
            .then((res) => {
              expect(res.body)
                .to.have.property('documents')
                .to.be.array();
              done();
            })
            .catch(err => done(err));
        });
        it(`should return an object with property documents which is an
        array of documents when query is successful`, (done) => {
          request(app)
            .get('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .query({ type: 'shared' })
            .then((res) => {
              expect(res.body)
                .to.have.property('documents')
                .to.be.array();
              done();
            })
            .catch(err => done(err));
        });
      });

      describe('GET /api/v1/documents/:id route', () => {
        it('should return 404 error when document is not found', (done) => {
          request(app)
            .get('/api/v1/documents/0')
            .set('authorization', `bearer ${userToken}`)
            .expect(404)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('document not found');
              done();
            })
            .catch(err => done(err));
        });
        it('should return 401 error when user is not authorized', (done) => {
          Document
            .findOne({
              where: {
                title: privateDoc1.title
              }
            })
            .then((document) => {
              request(app)
                .get(`/api/v1/documents/${document.id}`)
                // use token of a different user than the owner
                .set('authorization', `bearer ${overlordToken}`)
                .expect(401)
                .then((res) => {
                  expect(res.body)
                    .to.have.property('message')
                    .which.equals(
                      'you are not authorized to access this document'
                    );
                  done();
                })
                .catch(err => done(err));
            });
        });
        it('should return the document on success', (done) => {
          Document
            .findOne({
              where: {
                title: privateDoc1.title
              }
            })
            .then((document) => {
              request(app)
                .get(`/api/v1/documents/${document.id}`)
                .set('authorization', `bearer ${userToken}`)
                .expect(200)
                .then((res) => {
                  expect(res.body)
                    .to.have.property('document')
                    .which.has.property('title')
                    .which.equals(privateDoc1.title);
                  expect(res.body)
                    .to.have.property('document')
                    .to.have.property('content')
                    .which.equals(privateDoc1.content);
                  expect(res.body)
                    .to.have.property('rightId')
                    .which.equals(1);
                  done();
                })
                .catch(err => done(err));
            });
        });
        it('should return the document on success', (done) => {
          Document
            .findOne({
              where: {
                title: publicDoc1.title
              }
            })
            .then((document) => {
              request(app)
                .get(`/api/v1/documents/${document.id}`)
                .set('authorization', `bearer ${userToken}`)
                .expect(200)
                .then((res) => {
                  expect(res.body)
                    .to.have.property('document')
                    .which.has.property('title')
                    .which.equals(publicDoc1.title);
                  expect(res.body)
                    .to.have.property('document')
                    .to.have.property('content')
                    .which.equals(publicDoc1.content);
                  expect(res.body)
                    .to.have.property('rightId')
                    .which.equals(3);
                  done();
                })
                .catch(err => done(err));
            });
        });
      });

      describe('GET /api/v1/search/documents/ route', () => {
        it('should return error 404 when invalid user is trying to search',
        (done) => {
          request(app)
            .get('/api/v1/search/documents')
            .set('authorization', `bearer ${nonExistingUserToken}`)
            .expect(404)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('user not found');
              done();
            })
            .catch(err => done(err));
        });
        it('should return an object on success', (done) => {
          request(app)
            .get('/api/v1/search/documents')
            .set('authorization', `bearer ${overlordToken}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.be.an('object');
              done();
            })
            .catch(err => done(err));
        });
      });
    });

    describe('PUT /api/v1/documents/:id route', () => {
      it('should return 404 error when document is not found', (done) => {
        request(app)
          .put('/api/v1/documents/0')
          .set('authorization', `bearer ${userToken}`)
          .send(privateDoc1)
          .expect(404)
          .then((res) => {
            expect(res.body)
              .to.have.property('message')
              .which.equals('document not found');
            done();
          })
          .catch(err => done(err));
      });
      it(`should return the document reflecting the
      modification when modification is successful`, (done) => {
        const newContent = 'I just got changed';
        Document
          .findOne({
            where: {
              title: publicDoc1.title
            }
          })
          .then((document) => {
            request(app)
              .put(`/api/v1/documents/${document.id}`)
              .set('authorization', `bearer ${overlordToken}`)
              .send({ content: newContent })
              .expect(200)
              .then((res) => {
                expect(res.body)
                  .to.have.property('document')
                  .which.has.property('title')
                  .which.equals(publicDoc1.title);
                expect(res.body)
                  .to.have.property('document')
                  .which.has.property('content')
                  .which.equals(newContent);
                expect(res.body)
                  .to.have.property('document')
                  .which.does.not.have.property('createdAt');
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
      it('should return 401 error when user is not authorized', (done) => {
        Document
          .findOne({
            where: {
              title: privateDoc1.title
            }
          })
          .then((document) => {
            request(app)
              .put(`/api/v1/documents/${document.id}`)
              .set('authorization', `bearer ${overlordToken}`)
              .send({ title: 'new title' })
              .expect(401)
              .then((res) => {
                expect(res.body)
                  .to.have.property('message')
                  .which.equals(
                    'you are not authorized to access this document'
                  );
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
      it(`should return the document reflecting the
      modification when modification is successful`, (done) => {
        Document
          .findOne({
            where: {
              title: sharedDoc1.title
            }
          })
          .then((document) => {
            User
              .findById(1)
              .then((user) => {
                document.addUser(user, { through: { rightId: 3 } });
                request(app)
                  .put(`/api/v1/documents/${document.id}`)
                  .set('authorization', `bearer ${overlordToken}`)
                  .send({ content: 'new title' })
                  .expect(200)
                  .then((res) => {
                    expect(res.body)
                      .to.have.property('document')
                      .which.has.property('title')
                      .which.equals(sharedDoc1.title);
                    expect(res.body)
                      .to.have.property('document')
                      .which.has.property('content')
                      .which.equals('new title');
                    expect(res.body)
                      .to.have.property('document')
                      .which.does.not.have.property('createdAt');
                    done();
                  })
                  .catch(err => done(err));
              })
              .catch(err => done(err));
          });
      });
    });

    describe('DELETE /api/v1/documents/:id route', () => {
      it('should return 404 error when document is not found', (done) => {
        request(app)
          .delete('/api/v1/documents/0')
          .set('authorization', `bearer ${userToken}`)
          .expect(404)
          .then((res) => {
            expect(res.body)
              .to.have.property('message')
              .which.equals('document not found');
            done();
          })
          .catch(err => done(err));
      });
      it("should return 403 error when user doesn't have delete rights",
        (done) => {
          Document
            .findOne({
              where: {
                title: publicDoc1.title
              }
            })
            .then((document) => {
              request(app)
                .delete(`/api/v1/documents/${document.id}`)
                .set('authorization', `bearer ${userToken}`)
                .expect(403)
                .then((res) => {
                  expect(res.body)
                    .to.have.property('message')
                    .which.equals(
                      "you don't have the rights to delete this document"
                    );
                  done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        });
      it('should delete the document successfully', (done) => {
        Document
          .findOne({
            where: {
              title: publicDoc1.title
            }
          })
          .then((document) => {
            request(app)
              .delete(`/api/v1/documents/${document.id}`)
              .set('authorization', `bearer ${overlordToken}`)
              .expect(200)
              .then((res) => {
                expect(res.body)
                  .to.have.property('message')
                  .which.equals('document deleted successfully');
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
      it('should return 401 error when user does not have access rights',
        (done) => {
          Document
            .findOne({
              where: {
                title: privateDoc1.title
              }
            })
            .then((document) => {
              request(app)
                .delete(`/api/v1/documents/${document.id}`)
                .set('authorization', `bearer ${overlordToken}`)
                .expect(401)
                .then((res) => {
                  expect(res.body)
                    .to.have.property('message')
                    .which.equals(
                      'you are not authorized to access this document'
                    );
                  done();
                })
                .catch(err => done(err));
            })
            .catch(err => done(err));
        });
      it('should return 403 error when user is not authorized', (done) => {
        Document
          .findOne({
            where: {
              title: sharedDoc1.title
            }
          })
          .then((document) => {
            request(app)
              .delete(`/api/v1/documents/${document.id}`)
              .set('authorization', `bearer ${overlordToken}`)
              .expect(403)
              .then((res) => {
                expect(res.body)
                  .to.have.property('message')
                  .which.equals(
                    "you don't have the rights to delete this document"
                  );
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      });
    });
  });
});
