import { expect } from 'chai';
import localAuth from '../../auth/local';

describe('auth : local', () => {
  describe('encodeToken()', () => {
    it('should return a string as the encoded token', (done) => {
      const token = localAuth.encodeToken(1);
      expect(token).to.not.eql(undefined);
      expect(token).to.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    const token = localAuth.encodeToken(18);
    it('should return the actual value initially' +
    'encoded when token gets decoded', (done) => {
      localAuth.decodeToken(token, (err, payload) => {
        expect(err).to.eql(null);
        expect(payload.sub).to.equal(18);
        done();
      });
    });
  });
});
