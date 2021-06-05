import { createReducer, on, Action } from '@ngrx/store';
import { Profile } from 'iam-client-lib';
import * as UserActions from './user.actions';

export const USER_FEATURE_KEY = 'user';

export interface State {
  didDocument: any;
  profile: Profile;
  error?: string | null;
}

export const initialState: State = {
  didDocument: null,
  profile: null,
  error: ''
};

const userReducer = createReducer(
  initialState,
  on(UserActions.setProfile, UserActions.updateUserClaimsSuccess, (state, {profile}) => ({...state, profile})),
  on(UserActions.setDidDocument, (state, {didDocument}) => ({...state, didDocument}))
);

export function reducer(state: State | undefined, action: Action) {
  return userReducer(state, action);
}
