import { createAction, props } from '@ngrx/store';
import { AccountInfo, ProviderType } from 'iam-client-lib';

export const init = createAction(
  '[AUTH] Initialize Possible Options To Log In'
);

export const loginViaDialog = createAction(
  '[AUTH] Login User With Provider via Dialog',
  props<{ provider: ProviderType; navigateOnTimeout?: boolean }>()
);

export const welcomeLogin = createAction(
  '[AUTH][Welcome Page] Login User With Provider',
  props<{ provider: ProviderType; returnUrl: string }>()
);

export const openLoginDialog = createAction('[AUTH] Open Login Dialog');

export const loginSuccess = createAction('[AUTH] User Login Success');
export const loginFailure = createAction('[AUTH] User Login Failure');

export const setProvider = createAction(
  '[AUTH] Set Wallet Provider',
  props<{ walletProvider: ProviderType }>()
);

export const reinitializeAuthWithoutMetamask = createAction(
  '[AUTH] Reinitialize Logged User Without Metamask'
);

export const reinitializeAuthWithMetamask = createAction(
  '[AUTH] Reinitialize Logged User With Metamask'
);

export const logout = createAction('[AUTH] Logout');

export const logoutWithRedirectUrl = createAction(
  '[AUTH] Logout With Redirect URL'
);

export const setMetamaskLoginOptions = createAction(
  '[AUTH] Set Metamask LogIn Options',
  props<{ present: boolean; chainId: number | undefined }>()
);

export const navigateWhenSessionActive = createAction(
  '[AUTH] Navigate to dashboard when session is active'
);

export const setDefaultChainId = createAction(
  '[AUTH] Set Default Chain ID from ENV config',
  props<{ defaultChainId: number }>()
);
