import * as authSelectors from './auth.selectors';
import { ChainId } from '../../core/config/chain-id';
import { AuthState } from './auth.reducer';

describe('Auth Selectors', () => {
  describe('isMetamaskDisabled', () => {
    it('should return true when chainId is undefined', () => {
      expect(
        authSelectors.isMetamaskDisabled.projector({
          metamask: { chainId: undefined },
          defaultChainId: undefined,
        } as AuthState)
      ).toBeFalsy();
    });

    it('should return true when chainId is different than volta chain id', () => {
      expect(
        authSelectors.isMetamaskDisabled.projector({
          metamask: { chainId: 123 },
          defaultChainId: 1,
        } as AuthState)
      ).toBeTruthy();
    });

    it('should return false when metamaskChainId is set to Volta chain', () => {
      expect(
        authSelectors.isMetamaskDisabled.projector({
          metamask: { chainId: ChainId.Volta },
          defaultChainId: ChainId.Volta,
        } as AuthState)
      ).toBeFalsy();
    });
  });

  describe('isMetamaskPresent', () => {
    it('should return false when metamask is not present', () => {
      expect(
        authSelectors.isMetamaskPresent.projector({
          metamask: { present: false },
        } as AuthState)
      ).toBeFalsy();
    });

    it('should return true when metamask is present ', () => {
      expect(
        authSelectors.isMetamaskPresent.projector({
          metamask: { present: true },
        } as AuthState)
      ).toBeTruthy();
    });
  });

  describe('isUserLoggedIn', () => {
    it('should return false when user is not loggedIn', () => {
      expect(
        authSelectors.isUserLoggedIn.projector({ loggedIn: false } as AuthState)
      ).toBeFalsy();
    });

    it('should return true when user is logged in', () => {
      expect(
        authSelectors.isUserLoggedIn.projector({ loggedIn: true } as AuthState)
      ).toBeTruthy();
    });
  });
});
