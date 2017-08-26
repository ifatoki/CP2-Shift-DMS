import chai from 'chai';
import assertArrays from 'chai-arrays';
import Validator from '../../utils/Validator';

const expect = chai.expect;
chai.use(assertArrays);

describe('validator', () => {
  it('login should find 2 validation errors when no user details are entered',
  () => {
    const validator = Validator.validateLogin({});
    expect(Object.keys(validator.errors).length).to.equal(2);
    expect(validator.isValid).to.eql(false);
  });
  it('signup should find 5 validation errors wehn no user details are entered',
  () => {
    const validator = Validator.validateSignUp({});
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      identifier: 'username is required',
      firstname: 'firstname is required',
      lastname: 'lastname is required',
      email: 'email is required',
      password: 'password is required'
    });
  });
  it('validateuseredit with empty fields should find 5 validation errors',
  () => {
    const validator = Validator.validateUserEdit({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      newPassword: ''
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      identifier: 'email is required',
      firstname: 'firstname is required',
      lastname: 'lastname is required',
      email: 'email is required',
      password: 'current password is required'
    });
  });
  it(`validateuseredit with invalid email address should find 1
  validation error`, () => {
    const validator = Validator.validateUserEdit({
      email: 'email'
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      email: 'email is invalid'
    });
  });
  it(`validateuseredit with an empty string as newPassword should find
  1 validation error`, () => {
    const validator = Validator.validateUserEdit({
      newPassword: ''
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      password: 'current password is required'
    });
  });
  it(`validateuseredit with an empty string as newPassword and valid
  currentPassword should find 1 validation error`, () => {
    const validator = Validator.validateUserEdit({
      newPassword: '',
      currentPassword: 'current'
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      password: 'new password is required'
    });
  });
  it(`validateuseredit with a valid newPassword and currentPassword
  should find 1 validation error`, () => {
    const validator = Validator.validateUserEdit({
      newPassword: 'new',
      currentPassword: 'current'
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      password: 'confirm password is required'
    });
  });
  it(`validateuseredit with non matching password fields should find 1
  validation error`, () => {
    const validator = Validator.validateUserEdit({
      newPassword: 'new',
      currentPassword: 'current',
      confirmPassword: 'confirm'
    });
    expect(validator.isValid).eqls(false);
    expect(validator.errors).to.eqls({
      password: "passwords don't match"
    });
  });
});
