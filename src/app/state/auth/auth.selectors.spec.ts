import { isMetamaskDisabled } from './auth.selectors';
import { VOLTA_CHAIN_ID } from '../../shared/services/iam.service';

describe('Auth Selectors', () => {

  describe('isMetamaskDisabled', () => {
    it('should return true when chainId is undefined', () => {
      expect(isMetamaskDisabled.projector({metamaskChainId: undefined})).toBe(true);
    });

    it('should return false when metamaskChainId is set to Volta chain', () => {
      expect(isMetamaskDisabled.projector({metamaskChainId: VOLTA_CHAIN_ID})).toBe(false);
    });
  });

});
