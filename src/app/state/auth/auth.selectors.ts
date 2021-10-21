import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, USER_FEATURE_KEY } from './auth.reducer';
import { VOLTA_CHAIN_ID } from '../../shared/services/iam.service';

export const getAuthState = createFeatureSelector<AuthState>(USER_FEATURE_KEY);

export const isUserLoggedIn = createSelector(
  getAuthState,
  (state) => state.loggedIn
);

export const isMetamaskPresent = createSelector(
  getAuthState,
  (state) => state?.metamask.present
);

export const isMetamaskDisabled = createSelector(
  getAuthState,
  (state) =>
    state?.metamask.chainId && parseInt(`${state?.metamask.chainId}`, 16) !== VOLTA_CHAIN_ID
);

export const getWalletProvider = createSelector(
  getAuthState,
  (state) => state.walletProvider
);

export const getAccountInfo = createSelector(
  getAuthState,
  (state) => state.accountInfo
);


