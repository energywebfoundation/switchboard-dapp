/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction, props } from '@ngrx/store';
import { ClaimData, Profile } from 'iam-client-lib';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';

export const setUpUser = createAction('[User] Set Up User Data');

export const loadUserClaims = createAction('[User] Load User Claims');
export const setProfile = createAction(
  '[User] Set Profile',
  props<{ profile: Profile }>()
);
export const loadUserClaimsSuccess = createAction(
  '[User] Load User Claims Success',
  props<{ userClaims: (IServiceEndpoint & ClaimData)[] }>()
);
export const loadUserClaimsFailure = createAction(
  '[User] Load User Claims Failure',
  props<{ error: any }>()
);

export const updateLocalStateUserClaims = createAction(
  '[User] Update Local State User Claims ',
  props<{ profile: Partial<Profile> }>()
);

export const updateUserData = createAction(
  '[User] Update User Claims',
  props<{ userData: any }>()
);

export const updateUserClaimsFailure = createAction(
  '[User] Update User Claims Failure',
  props<{ error: any }>()
);

export const updateUserClaimsSuccess = createAction(
  '[User] Update User Claims Success',
  props<{ profile: Partial<Profile> }>()
);

export const clearUserClaim = createAction('[User] Clear User Claim');

export const setDidDocument = createAction(
  '[User] Set User Did Document',
  props<{ didDocument: any }>()
);
