import { createAction, props } from '@ngrx/store';
import { ClaimData } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';
import { Profile } from 'iam-client-lib';

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

export const setDidDocument = createAction(
  '[User] Set User Did Document',
  props<{ didDocument: any }>()
);


