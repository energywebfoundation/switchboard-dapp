import { Action, createReducer, on } from '@ngrx/store';
import { Profile } from 'iam-client-lib';
import * as userActions from './user.actions';
import { userLocalStorage } from '../../shared/utils/local-storage-wrapper';

export const USER_FEATURE_KEY = 'user';

export interface UserClaimState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  didDocument: any;
  profile: Profile;
  error?: string | null;
  userData: {
    name: string;
    birthdate: string;
    address: string;
  };
}

export const initialState: UserClaimState = {
  didDocument: null,
  profile: null,
  error: '',
  userData: null,
};

const userReducer = createReducer(
  initialState,
  on(
    userActions.setProfile,
    userActions.updateLocalStateUserClaims,
    (state, { profile }) => ({
      ...state,
      profile,
    })
  ),
  on(userActions.updateUserData, (state, { userData }) => {
    userLocalStorage.parsed = {
      ...userLocalStorage.parsed,
      [state?.didDocument?.id]: userData,
    };
    return { ...state, userData };
  }),
  on(userActions.clearUserClaim, (state) => ({
    ...state,
    profile: null,
    didDocument: null,
  })),
  on(userActions.setDidDocument, (state, { didDocument }) => ({
    ...state,
    didDocument,
  }))
);

export function reducer(state: UserClaimState | undefined, action: Action) {
  return userReducer(state, action);
}
