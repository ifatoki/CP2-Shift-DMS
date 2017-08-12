import { expect } from 'chai';
import localAuth from '../../auth/local';

describe('auth : local', () => {
  describe('encodeToken()', () => {
    it('should return a string as the encoded token', (done) => {
      const token = localAuth.encodeToken(1);
      expect(token).to.exist;
      expect(token).to.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    const token = localAuth.encodeToken(18);
    it('should return the actual value initially \
    encoded when token gets decoded',
    (done) => {
      localAuth.decodeToken(token, (err, payload) => {
        expect(err).not.to.exist;
        expect(payload.sub).to.equal(18);
        done();
      });
    });
  });
});
