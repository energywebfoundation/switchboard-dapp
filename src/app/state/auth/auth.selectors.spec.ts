import * as authSelectors from './auth.selectors';

describe('Auth Selectors', () => {

  describe('isMetamaskDisabled', () => {
    it('should return true when chainId is undefined', () => {
      expect(authSelectors.isMetamaskDisabled.projector({metamask: {chainId: undefined}})).toBeFalsy();
    });

    it('should return true when chainId is different than volta chain id', () => {
      expect(authSelectors.isMetamaskDisabled.projector({metamask: {chainId: 123}})).toBeTruthy();
    });

    it('should return false when metamaskChainId is set to Volta chain', () => {
      expect(authSelectors.isMetamaskDisabled.projector({metamask: {chainId: '0x12047'}})).toBeFalsy();
    });
  });

  describe('isMetamaskPresent', () => {
    it('should return false when metamask is not present', () => {
      expect(authSelectors.isMetamaskPresent.projector({metamask: {present: false}})).toBeFalsy();
    });

    it('should return true when metamask is present ', () => {
      expect(authSelectors.isMetamaskPresent.projector({metamask: {present: true}})).toBeTruthy();
    });
  });

});
