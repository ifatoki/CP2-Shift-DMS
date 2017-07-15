import { expect } from 'chai';
import localAuth from '../../auth/local';

process.env.NODE_ENV = 'test';

describe('auth : local', () => {
  describe('encodeToken()', () => {
    it('should return a token', (done) => {
      const token = localAuth.encodeToken(1);
      expect(token).to.exist;
      expect(token).to.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    const token = localAuth.encodeToken(18);
    it('should return the actual value initially encoded', (done) => {
      localAuth.decodeToken(token, (err, payload) => {
        expect(err).not.to.exist;
        expect(payload.sub).to.equal(18);
        done();
      });
    });
  });
});
