import { createAction, props } from '@ngrx/store';
import { WalletProvider } from 'iam-client-lib';

export const init = createAction(
  '[AUTH] Initialize Possible Options To Log In'
);

export const login = createAction(
  '[AUTH] Login User With Provider',
  props<{ provider: WalletProvider, navigateOnTimeout?: boolean }>()
);

export const welcomeLogin = createAction(
  '[AUTH][Welcome Page] Login User With Provider',
  props<{ provider: WalletProvider, returnUrl: string }>()
);

export const loginSuccess = createAction(
  '[AUTH] User Login Success'
);
export const loginFailure = createAction(
  '[AUTH] User Login Failure'
);

export const reinitializeAuth = createAction(
  '[AUTH] Reinitialize Logged User',
  props<{redirectUrl: string}>()
)

export const logout = createAction(
  '[AUTH] Logout'
);

export const getMetamaskOptions = createAction(
  '[AUTH] Get Metamask Login Options'
);

export const setMetamaskLoginOptions = createAction(
  '[AUTH] Set Metamask LogIn Options',
  props<{ present: boolean, chainId: number | undefined }>()
);
