import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { WalletProvider } from 'iam-client-lib';

export const USER_FEATURE_KEY = 'auth';

export interface AuthState {
  walletProvider: WalletProvider | undefined;
  metamask: {
    present: boolean;
    chainId: number | undefined;
  };
  loggedIn: boolean;
}

export const initialState: AuthState = {
  walletProvider: undefined,
  metamask: {
    present: true,
    chainId: undefined
  },
  loggedIn: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({...state, loggedIn: true})),
  on(AuthActions.logout, AuthActions.logoutWithRedirectUrl, (state) => ({
    ...state,
    loggedIn: false,
    walletProvider: undefined
  })),
  on(AuthActions.setMetamaskLoginOptions, (state, {present, chainId}) => ({
      ...state, metamask: {present, chainId}
    })
  ),
  on(AuthActions.setProvider, (state, {walletProvider}) => ({...state, walletProvider}))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
