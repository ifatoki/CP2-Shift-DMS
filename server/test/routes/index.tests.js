import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import _ from 'lodash';
import faker from 'faker';
import app from '../../app';
import * as tokens from '../helpers/tokens';
import postData from '../helpers/testdata';
import local from '../../auth/local';
import helpers from '../../auth/helpers';

const { Right, Role, User, Document } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const { overlordToken, userToken, nonExistingUserToken } = tokens;
const { users } = postData;

describe('routes : index', () => {
  describe('Endpoints: Right', () => {
    describe('GET route', () => {
      it('should return an array when queried in its initial raw state',
        (done) => {
          request(app)
            .get('/api/v1/rights')
            .set('authorization', `bearer ${overlordToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.have.a.property('rights');
              expect(res.body.rights).to.be.array().ofSize(3);
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
      it('should return 403 error when a right with the \
      same title already exists',
      (done) => {
        request(app)
          .post('/api/v1/rights')
          .type('form')
          .set('authorization', `bearer ${overlordToken}`)
          .send({
            title: 'read',
            description: 'My awesome avatar'
          })
          .then((res) => {
            expect(res.status).to.equal(403);
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

  describe('Endpoints: Role', () => {
    describe('GET route', () => {
      it('should return an object with a property roles which is an array',
      (done) => {
        request(app)
          .get('/api/v1/roles')
          .set('authorization', `bearer ${overlordToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body)
              .to.have.property('roles')
              .which.is.array()
              .ofSize(3);
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
            expect(_.map(res.body.roles, role => role.id))
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

  describe('Endpoints: User', () => {
    after('Clean out the newly added users', () => {
      User.destroy({
        where: {
          username: users.admin.username
        },
        cascade: true,
        restartIdentity: true
      });
    });

    describe('GET route', () => {
      describe('GET /api/v1/users', () => {
        it('should return an object with property users which is an array',
        (done) => {
          request(app)
            .get('/api/v1/users')
            .set('authorization', `bearer ${overlordToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('users')
                .which.is.array()
                .ofSize(2);
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it('should return 403 error when user is not the overlord', (done) => {
          request(app)
            .get('/api/v1/users')
            .set('authorization', `bearer ${userToken}`)
            .expect('Content-Type', /json/)
            .expect(403)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('only overlord can view all users');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it('should not return the overlord user(an object with id = 1)',
          (done) => {
            request(app)
              .get('/api/v1/users')
              .set('authorization', `bearer ${overlordToken}`)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((res) => {
                expect(_.map(res.body, user => user.id))
                  .not.to.be.containing(1);
                done();
              })
              .catch((err) => {
                done(err);
              });
          });
      });

      describe('GET /api/v1/users/:id', () => {
        it('should return 404 error when user id is not found', (done) => {
          request(app)
            .get(`/api/v1/users/${-1}`)
            .set('authorization', `bearer ${overlordToken}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('user not found');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it('should return the user with the passed id if it is valid',
        (done) => {
          request(app)
            .get('/api/v1/users/2')
            .set('authorization', `bearer ${overlordToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('user')
                .which.has.property('id')
                .which.equals(2);
              expect(res.body)
                .to.have.property('user')
                .which.has.property('role');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });

      describe('GET /api/v1/users/:id/documents', () => {
        it('should return error 404 for invalid user', (done) => {
          request(app)
            .get('/api/v1/users/0/documents')
            .set('authorization', `bearer ${overlordToken}`)
            .expect(404)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('user not found');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
        it("should return error 403 when user doesn't match requested user",
          (done) => {
            request(app)
              .get('/api/v1/users/1/documents')
              .set('authorization', `bearer ${userToken}`)
              .expect(403)
              .then((res) => {
                expect(res.body)
                  .to.have.property('message')
                  .which.equals("you can't fetch another users documents");
                done();
              })
              .catch((err) => {
                done(err);
              });
          }
        );
        it('should return an array of documents when query is successful',
        (done) => {
          request(app)
            .get('/api/v1/users/2/documents')
            .set('authorization', `bearer ${userToken}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('documents')
                .which.is.array();
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });

      describe('GET /api/v1/search/users/', () => {
        it('should return an object with property users which is an array \
        when query is successful',
        (done) => {
          const query = 'it';
          request(app)
            .get(`/api/v1/search/users?q=${query}`)
            .set('authorization', `bearer ${overlordToken}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('users')
                .which.is.array();
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });
    });

    describe('POST route', () => {
      it('should return 404 error when non existing role is entered',
        (done) => {
          request(app)
            .post('/api/v1/users')
            .type('form')
            .send(users.fellows)
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body)
                .to.have.property('message')
                .which.equals(
                  "role with passed roleId doesn't exist. change roleId");
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return the new user and a token when signup is successful',
      (done) => {
        request(app)
          .post('/api/v1/users')
          .type('form')
          .send(users.admin)
          .then((res) => {
            expect(res.status).to.equal(201);
            expect(res.body)
              .to.have.property('user')
              .which.has.property('firstname')
              .which.equals(users.admin.firstname);
            expect(res.body)
              .to.have.property('token');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return a 404 error when a non existing username is entered.',
        (done) => {
          request(app)
            .post('/api/v1/users/login')
            .type('form')
            .send({
              username: 'random and invalid username',
              password: 'itunu'
            })
            .then((res) => {
              expect(res.status).to.equal(404);
              expect(res.body)
                .to.have.property('message')
                .which.equals('user not found');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return error 401 when an invalid password is entered',
        (done) => {
          request(app)
            .post('/api/v1/users/login')
            .type('form')
            .send({
              username: users.admin.email,
              password: 'invalidPassword'
            })
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(res.body)
                .to.have.property('message')
                .which.equals('invalid password');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return the user and a token on successful login', (done) => {
        request(app)
          .post('/api/v1/users/login')
          .type('form')
          .send({
            username: users.admin.email,
            password: users.admin.password
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body)
              .to.have.property('user')
              .which.has.property('firstname')
              .which.equals(users.admin.firstname);
            expect(res.body)
              .to.have.property('token');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return 200 and a success message on logout', (done) => {
        request(app)
          .post('/api/v1/users/logout')
          .set('authorization', `bearer ${userToken}`)
          .type('form')
          .send()
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body)
              .to.have.property('message')
              .which.equals('user signed out');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });

    describe('PUT /api/v1/users/:id route', () => {
      it('should return 403 error when a user tries to update another profile',
        (done) => {
          const newEmail = faker.internet.email();
          request(app)
            .put('/api/v1/users/2')
            .set('authorization', `bearer ${overlordToken}`)
            .type('form')
            .send({
              email: newEmail
            })
            .then((res) => {
              expect(res.status).to.equal(403);
              expect(res.body)
                .to.have.property('message')
                .which.equals('only a user can edit his details');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return 404 error when userId is not found', (done) => {
        const newEmail = faker.internet.email();
        request(app)
          .put('/api/v1/users/0')
          .set('authorization', `bearer ${nonExistingUserToken}`)
          .type('form')
          .send({
            email: newEmail
          })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body)
              .to.have.property('message')
              .which.equals('user not found');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return 403 error when update email already exists',
        (done) => {
          const newEmail = users.admin.email;
          request(app)
            .put('/api/v1/users/1')
            .set('authorization', `bearer ${overlordToken}`)
            .type('form')
            .send({
              email: newEmail
            })
            .then((res) => {
              expect(res.status).to.equal(403);
              expect(res.body)
                .to.have.property('message').which
                .equals('a user already has that email address or username');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return the modified user with the new \
      email on successful update',
      (done) => {
        const newEmail = faker.internet.email();
        request(app)
          .put('/api/v1/users/1')
          .set('authorization', `bearer ${overlordToken}`)
          .type('form')
          .send({
            email: newEmail
          })
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body)
              .to.have.property('user')
              .which.has.property('role')
              .which.equals('overlord');
            expect(res.body)
              .to.have.property('user')
              .which.has.property('email')
              .which.equals(newEmail);
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return error 400 when currentPassword isnt sent with request',
        (done) => {
          const newPassword = faker.internet.password();
          request(app)
            .put('/api/v1/users/1')
            .set('authorization', `bearer ${overlordToken}`)
            .type('form')
            .send({
              newPassword
            })
            .then((res) => {
              expect(res.status).to.equal(400);
              expect(res.body)
                .to.have.property('message')
                .which.equals('current password is required\n');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return the user with new modified password when successful',
        (done) => {
          const newPassword = faker.internet.password();
          User.findOne({
            where: {
              username: users.admin.username
            },
            attributes: ['id']
          })
          .then((user) => {
            const adminToken = local.encodeToken(user);
            request(app)
              .put(`/api/v1/users/${user.id}`)
              .set('authorization', `bearer ${adminToken}`)
              .type('form')
              .send({
                newPassword,
                currentPassword: users.admin.password,
                confirmPassword: newPassword
              })
              .then((res) => {
                expect(res.status).to.equal(200);
                expect(res.body)
                  .to.have.property('user')
                  .which.has.property('role')
                  .which.equals('admin');
                expect(res.body)
                  .to.have.property('user')
                  .which.has.property('username')
                  .which.equals(users.admin.username);
                User.findOne({
                  where: {
                    username: users.admin.username
                  },
                  attributes: ['password']
                })
                .then((modifiedUser) => {
                  expect(helpers
                    .comparePassword(newPassword, modifiedUser.password)
                  ).to.be.true;
                });
                done();
              })
              .catch((err) => {
                done(err);
              });
          })
          .catch(error => done(error));
        });
    });

    describe('DELETE /api/v1/users/:id route', () => {
      it('should return 403 error if user is not overlord', (done) => {
        User.findOne({
          where: {
            username: users.admin.username
          },
          attributes: ['id']
        })
        .then((user) => {
          request(app)
            .delete(`/api/v1/users/${user.id}`)
            .set('authorization', `bearer ${userToken}`)
            .expect(403)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('only overlord can delete user');
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch(error => done(error));
      });
      it('should return 403 error if overlord tries deleting himself',
        (done) => {
          request(app)
            .delete('/api/v1/users/1')
            .set('authorization', `bearer ${overlordToken}`)
            .expect(403)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('you cannot delete the overlord');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return 404 error if user is not found', (done) => {
        request(app)
          .delete('/api/v1/users/0')
          .set('authorization', `bearer ${overlordToken}`)
          .expect(404)
          .then((res) => {
            expect(res.body)
              .to.have.property('message')
              .which.equals('user not found');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
      it('should return success message and actually delete user \
      when all requirements are met',
      (done) => {
        User.findOne({
          where: {
            username: users.admin.username
          },
          attributes: ['id']
        })
        .then((user) => {
          request(app)
            .delete(`/api/v1/users/${user.id}`)
            .set('authorization', `bearer ${overlordToken}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('user deleted successfully');
              User.findOne({
                where: {
                  username: users.admin.username
                },
                attributes: ['id']
              })
              .then(matchedUser => expect(matchedUser).to.be.null);
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch(error => done(error));
      });
    });
  });

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
        it('should create and return new document as all requirements are met',
        (done) => {
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
        it('should create and return new document as all requirements are met',
        (done) => {
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
        it('should create and return new document as all requirements are met',
        (done) => {
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
        it('should return error 403 when title already exists', (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(privateDoc1)
            .expect(403)
            .then((res) => {
              expect(res.body)
                .to.have.property('message')
                .which.equals('a document with that title already exists');
              done();
            })
            .catch(err => done(err));
        });
        it('should return error 403 when title already exists', (done) => {
          request(app)
            .post('/api/v1/documents')
            .set('authorization', `bearer ${userToken}`)
            .type('form')
            .send(privateDoc1)
            .expect(403)
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
        it('should return an object with property documents which is an array\
        when query is successful',
        (done) => {
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
        it('should return an object with property documents which is an array \
        when query is successful',
        (done) => {
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
        it('should return an object with property documents which is \
        an array of documents when query is successful', (done) => {
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
        it('should return an object with property documents which is an \
        array of documents when query is successful', (done) => {
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
        it('should return an object on success', (done) => {
          request(app)
            .get('/api/v1/search/documents')
            .set('authorization', `bearer ${userToken}`)
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
      it('should return the document reflecting the \
      modification when modification is successful', (done) => {
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
      it('should return the document reflecting the \
      modification when modification is successful', (done) => {
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
      it('should return 401 error when user does not have delete rights',
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
