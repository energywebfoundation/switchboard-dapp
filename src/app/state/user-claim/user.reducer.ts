import { createReducer, on, Action } from '@ngrx/store';
import { Profile } from 'iam-client-lib';
import * as userActions from './user.actions';

export const USER_FEATURE_KEY = 'user';

export interface UserClaimState {
  didDocument: any;
  profile: Profile;
  error?: string | null;
}

export const initialState: UserClaimState = {
  didDocument: null,
  profile: null,
  error: ''
};

const userReducer = createReducer(
  initialState,
  on(userActions.setProfile, userActions.updateUserClaimsSuccess, (state, {profile}) => ({...state, profile})),
  on(userActions.clearUserClaim, (state) => ({...state, profile: null, didDocument: null})),
  on(userActions.setDidDocument, (state, {didDocument}) => ({...state, didDocument}))
);

export function reducer(state: UserClaimState | undefined, action: Action) {
  return userReducer(state, action);
}
