import { createReducer, on, Action } from '@ngrx/store';
import { Profile } from 'iam-client-lib';
import * as UserActions from './user.actions';

export const USER_FEATURE_KEY = 'user';

export interface State {
  didDocument: any;
  profile: Profile;
  loading: boolean;
  error?: string | null;
}

export interface UserPartialState {
  readonly [USER_FEATURE_KEY]: State;
}

export const initialState: State = {
  didDocument: '',
  profile: {},
  loading: false,
  error: ''
};

const userReducer = createReducer(
  initialState,
  on(UserActions.setProfile, (state, {profile}) => ({...state, profile})),
  on(UserActions.setDidDocument, (state, {didDocument}) => ({...state, didDocument}))
);

export function reducer(state: State | undefined, action: Action) {
  return userReducer(state, action);
}
