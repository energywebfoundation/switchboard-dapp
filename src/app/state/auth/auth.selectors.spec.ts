import * as authSelectors from './auth.selectors';
import { getWalletProvider } from './auth.selectors';
import { WalletProvider } from 'iam-client-lib';

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

  describe('isUserLoggedIn', () => {
    it('should return false when user is not loggedIn', () => {
      expect(authSelectors.isUserLoggedIn.projector({loggedIn: false})).toBeFalsy();
    });

    it('should return true when user is logged in', () => {
      expect(authSelectors.isUserLoggedIn.projector({loggedIn: true})).toBeTruthy();
    });
  });

  describe('getWalletProvider', () => {
    it('should return undefined when wallet is not defined', () => {
      expect(authSelectors.getWalletProvider.projector({walletProvider: undefined})).toBeUndefined();
    });

    it('should return defined wallet provider', () => {
      expect(authSelectors.getWalletProvider.projector({walletProvider: WalletProvider.WalletConnect})).toBe(WalletProvider.WalletConnect);
    });
  });

});
