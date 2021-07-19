import { createAction, props } from '@ngrx/store';
import { Stake, WalletProvider } from 'iam-client-lib';
import { LoginOptions } from '../../shared/services/iam.service';

export const init = createAction(
  '[AUTH] Initialize Possible Options To Log In'
);

export const loginHeaderStakingButton = createAction(
  '[AUTH] Staking User Login With Button In Header',
);

export const loginBeforeStakeIfNotLoggedIn = createAction(
  '[AUTH] Staking Login Before Stake If Not Logged In',
  props<{ amount: string }>()
);

export const loginSuccess = createAction(
  '[AUTH] User Login Success'
);
export const loginFailure = createAction(
  '[AUTH] User Login Failure'
);

export const logout = createAction(
  '[AUTH] Logout'
);

export const setAuth = createAction(
  '[AUTH] Setting User Authorization',
  props<{ loggedIn: boolean }>()
);

export const getMetamaskOptions = createAction(
  '[AUTH] Get Metamask Login Options'
);

export const setMetamaskLoginOptions = createAction(
  '[AUTH] Set Metamask LogIn Options',
  props<{ present: boolean, chainId: number | undefined }>()
);
