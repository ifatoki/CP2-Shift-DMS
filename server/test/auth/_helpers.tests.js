process.env.NODE_ENV = 'test';

const chai = require('chai');

const expect = chai.expect;
const authHelpers = require('../../auth/_helpers');

describe('auth : _helpers', () => {
  describe('The placeholder test', () => {
    it('should pass the placeholder test', () => {
      expect(2 + 4).to.equal(6);
    });
  });
});
