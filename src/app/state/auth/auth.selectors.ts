import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, USER_FEATURE_KEY } from './auth.reducer';

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
  (state) => state?.metamask.chainId !== state?.defaultChainId
);
