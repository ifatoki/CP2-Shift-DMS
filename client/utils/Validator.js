import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default class Validator {
  static validateLogin({ username, password }) {
    this.errors = {};
    if (validator.isEmpty(username.toString()) || username === undefined) {
      this.errors.identifier = 'email or username required';
    }
    if (validator.isEmpty(password.toString()) || password === undefined) {
      this.errors.password = 'password is required';
    }
    return this.reconcileErrors();
  }

  static validateSignUp({
    username, firstname, lastname, email, password, comparePassword
  }) {
    this.errors = {};
    if (validator.isEmpty(username.toString()) || username === undefined) {
      this.errors.identifier = 'username is required';
    }
    if (validator.isEmpty(firstname.toString()) || firstname === undefined) {
      this.errors.firstname = 'firstname is required';
    }
    if (validator.isEmpty(lastname.toString()) || lastname === undefined) {
      this.errors.lastname = 'lastname is required';
    }
    if (validator.isEmpty(email.toString()) || email === undefined) {
      this.errors.email = 'email is required';
    } else if (!validator.isEmail(email.toString())) {
      this.errors.email = 'email is invalid';
    }
    if (validator.isEmpty(password.toString()) || password === undefined) {
      this.errors.password = 'password is required';
    } else if (password !== comparePassword) {
      this.errors.password = "passwords don't match";
    }
    return this.reconcileErrors();
  }

  static validateUserEdit({
    username, firstname, lastname, email,
    currentPassword, newPassword, confirmPassword
  }) {
    this.errors = {};
    if (username === '') {
      this.errors.identifier = 'email is required';
    }
    if (firstname === '') {
      this.errors.firstname = 'firstname is required';
    }
    if (lastname === '') {
      this.errors.lastname = 'lastname is required';
    }
    if (email !== undefined) {
      if (validator.isEmpty(email.toString())) {
        this.errors.email = 'email is required';
      } else if (!validator.isEmail(email.toString())) {
        this.errors.email = 'email is invalid';
      }
    }
    if (currentPassword !== undefined) {
      if (validator.isEmpty(currentPassword.toString())) {
        this.errors.password = 'current password is required';
      } else if (validator.isEmpty(newPassword.toString())) {
        this.errors.password = 'new password is required';
      } else if (validator.isEmpty(confirmPassword.toString())) {
        this.errors.password = 'confirm password is required';
      } else if (newPassword !== confirmPassword) {
        this.errors.password = "passwords don't match";
      }
    }
    return this.reconcileErrors();
  }

  static validateNewDocument({ title, accessId }) {
    this.errors = {};
    if (validator.isEmpty(title.toString()) || title === undefined) {
      this.errors.title = 'title is required';
    }
    if (validator.isEmpty(accessId.toString()) || accessId === undefined) {
      this.errors.accessId = 'accessId is required';
    } else if (!validator.isInt(accessId.toString())) {
      this.errors.accessId = 'accessId must be a number';
    }
    return this.reconcileErrors();
  }

  static validateDocumentEdit({ title, accessId }) {
    this.errors = {};
    if (title === '') {
      this.errors.title = 'title is required';
    }
    if (accessId !== undefined) {
      if (validator.isEmpty(accessId.toString())) {
        this.errors.accessId = 'accessId is required';
      } else if (!validator.isInt(accessId.toString())) {
        this.errors.accessId = 'accessId must be a number';
      }
    }
    return this.reconcileErrors();
  }

  static reconcileErrors() {
    return {
      errors: this.errors,
      isValid: isEmpty(this.errors)
    };
  }
}
