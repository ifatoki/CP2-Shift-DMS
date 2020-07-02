import chai from 'chai';
import assertArrays from 'chai-arrays';
import request from 'supertest';
import lodash from 'lodash';
import faker from 'faker';
import app from '../../app';
import Tokens from '../helpers/Tokens';
import TestData from '../helpers/TestData';
import local from '../../auth/Local';
import AuthHelpers from '../../auth/AuthHelpers';

const { User } = require('../../models');

const expect = chai.expect;
chai.use(assertArrays);

const { overlordToken, userToken, nonExistingUserToken } = Tokens;
const { users } = TestData;

describe('User Controllers : ', () => {
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
                .which.is.array().ofSize(2);
              expect(res.body.users[0])
                .to.have.property('username', 'prof_turb');
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
                expect(lodash.map(res.body, user => user.id))
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
              expect(res.body.documents[0])
                .to.have.property('title');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      });

      describe('GET /api/v1/search/users/', () => {
        it(`should return an object with property users which is an array
        when query is successful`, (done) => {
          const query = 'prof';
          request(app)
            .get(`/api/v1/search/users?q=${query}`)
            .set('authorization', `bearer ${overlordToken}`)
            .expect(200)
            .then((res) => {
              expect(res.body)
                .to.have.property('users')
                .which.is.array();
              expect(res.body.users[0]).to.have.property('username');
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
      it('should return 409 error when username already exists',
        (done) => {
          request(app)
            .post('/api/v1/users')
            .type('form')
            .send({
              ...users.fellows,
              username: 'itunuworks'
            })
            .then((res) => {
              expect(res.status).to.equal(409);
              expect(res.body)
                .to.have.property('message')
                .which.equals(
                  'a user with that email or username already exists'
                );
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it('should return 409 error when new overlord is requested created',
        (done) => {
          request(app)
            .post('/api/v1/users')
            .type('form')
            .send({
              ...users.fellows,
              roleId: 1
            })
            .then((res) => {
              expect(res.status).to.equal(409);
              expect(res.body)
                .to.have.property('message')
                .which.equals(
                  'overlord already exists'
                );
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
      it(`should return 403 error when a user tries to update another users
      profile`, (done) => {
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
      it('should return 409 error when update email already exists',
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
              expect(res.status).to.equal(409);
              expect(res.body)
                .to.have.property('message').which
                .equals('a user already has that email address or username');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
      it(`should return the modified user with the new
      email on successful update`, (done) => {
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
                  expect(AuthHelpers
                    .comparePassword(newPassword, modifiedUser.password)
                  ).to.eql(true);
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
      it(`should return success message and actually delete user
      when all requirements are met`, (done) => {
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
});
