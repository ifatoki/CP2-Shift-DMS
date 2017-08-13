import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default class Validator {
  static validateLogin({ username, password }) {
    this.errors = {};
    if (username === undefined || validator.isEmpty(username.toString())) {
      this.errors.identifier = 'email or username required';
    }
    if (password === undefined || validator.isEmpty(password.toString())) {
      this.errors.password = 'password is required';
    }
    return this.reconcileErrors();
  }

  static validateSignUp({
    username, firstname, lastname, email, password, confirmPassword
  }) {
    this.errors = {};
    if (username === undefined || validator.isEmpty(username.toString())) {
      this.errors.identifier = 'username is required';
    }
    if (firstname === undefined || validator.isEmpty(firstname.toString())) {
      this.errors.firstname = 'firstname is required';
    }
    if (lastname === undefined || validator.isEmpty(lastname.toString())) {
      this.errors.lastname = 'lastname is required';
    }
    if (email === undefined || validator.isEmpty(email.toString())) {
      this.errors.email = 'email is required';
    } else if (!validator.isEmail(email.toString())) {
      this.errors.email = 'email is invalid';
    }
    if (password === undefined || validator.isEmpty(password.toString())) {
      this.errors.password = 'password is required';
    } else if (password !== confirmPassword) {
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
    if (newPassword !== undefined) {
      if (!currentPassword || validator.isEmpty(currentPassword.toString())) {
        this.errors.password = 'current password is required';
      } else if (!newPassword || validator.isEmpty(newPassword.toString())) {
        this.errors.password = 'new password is required';
      } else if (!confirmPassword ||
        validator.isEmpty(confirmPassword.toString())) {
        this.errors.password = 'confirm password is required';
      } else if (newPassword !== confirmPassword) {
        this.errors.password = "passwords don't match";
      }
    }
    return this.reconcileErrors();
  }

  static validateNewDocument({ title, accessId }) {
    this.errors = {};
    if (title === undefined || validator.isEmpty(title.toString())) {
      this.errors.title = 'title is required';
    }
    if (accessId === undefined || validator.isEmpty(accessId.toString())) {
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
