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
  (state) => state.metamaskPresent
);

export const isMetamaskDisabled = createSelector(
  getAuthState,
  (state) => {
    console.log(state.metamaskChainId);
    return !state.metamaskChainId && parseInt(`${state.metamaskChainId}`, 16) !== VOLTA_CHAIN_ID;
  }
);


