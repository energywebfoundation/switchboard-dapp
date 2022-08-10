import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AccountInfo, ProviderType } from 'iam-client-lib';

export const USER_FEATURE_KEY = 'auth';

export interface AuthState {
  metamask: {
    present: boolean;
    chainId: number | undefined;
  };
  defaultChainId: number;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  metamask: {
    present: true,
    chainId: undefined,
  },
  defaultChainId: undefined,
  loggedIn: false,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    loggedIn: true,
  })),
  on(AuthActions.logout, AuthActions.logoutWithRedirectUrl, (state) => ({
    ...state,
    loggedIn: false,
  })),
  on(AuthActions.setMetamaskLoginOptions, (state, { present, chainId }) => ({
    ...state,
    metamask: { present, chainId },
  })),
  on(AuthActions.setProvider, (state, { walletProvider }) => ({
    ...state,
    walletProvider,
  })),
  on(AuthActions.setDefaultChainId, (state, { defaultChainId }) => ({
    ...state,
    defaultChainId,
  }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
