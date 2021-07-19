import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const USER_FEATURE_KEY = 'auth';

export interface AuthState {
  metamaskPresent: boolean;
  metamaskChainId: number | undefined;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  metamaskPresent: true,
  metamaskChainId: undefined,
  loggedIn: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({...state, loggedIn: true})),
  on(AuthActions.logout, (state) => ({...state, loggedIn: false})),
  on(AuthActions.setMetamaskLoginOptions, (state, {present, chainId}) => ({
      ...state, metamaskPresent: present, metamaskChainId: chainId
    })
  )
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
