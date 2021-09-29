import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { WalletProvider } from 'iam-client-lib';
import { AccountInfo } from 'iam-client-lib/dist/src/iam';

export const USER_FEATURE_KEY = 'auth';

export interface AuthState {
  walletProvider: WalletProvider | undefined;
  accountInfo: AccountInfo;
  metamask: {
    present: boolean;
    chainId: number | undefined;
  };
  loggedIn: boolean;
}

export const initialState: AuthState = {
  walletProvider: undefined,
  accountInfo: undefined,
  metamask: {
    present: true,
    chainId: undefined
  },
  loggedIn: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, {accountInfo}) => ({...state, loggedIn: true, accountInfo})),
  on(AuthActions.logout, AuthActions.logoutWithRedirectUrl, (state) => ({
    ...state,
    loggedIn: false,
    walletProvider: undefined,
    accountInfo: undefined
  })),
  on(AuthActions.setMetamaskLoginOptions, (state, {present, chainId}) => ({
      ...state, metamask: {present, chainId}
    })
  ),
  on(AuthActions.setProvider, (state, {walletProvider}) => ({...state, walletProvider})),
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
