import { isMetamaskDisabled } from './auth.selectors';

describe('Auth Selectors', () => {

  describe('isMetamaskDisabled', () => {
    it('should return true when chainId is undefined', () => {
      expect(isMetamaskDisabled.projector({metamaskChainId: undefined})).toBeFalsy();
    });

    it('should return true when chainId is different than volta chain id', () => {
      expect(isMetamaskDisabled.projector({metamaskChainId: 123})).toBeTruthy();
    });

    it('should return false when metamaskChainId is set to Volta chain', () => {
      expect(isMetamaskDisabled.projector({metamaskChainId: '0x12047'})).toBeFalsy();
    });
  });

});
