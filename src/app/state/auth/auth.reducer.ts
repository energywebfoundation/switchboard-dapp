import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const USER_FEATURE_KEY = 'auth';

export interface AuthState {
  metamask: {
    present: boolean;
    chainId: number | undefined;
  };
  loggedIn: boolean;
}

export const initialState: AuthState = {
  metamask: {
    present: true,
    chainId: undefined
  },
  loggedIn: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state) => ({...state, loggedIn: true})),
  on(AuthActions.logout, (state) => ({...state, loggedIn: false})),
  on(AuthActions.setMetamaskLoginOptions, (state, {present, chainId}) => ({
      ...state, metamask: {present, chainId}
    })
  )
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
