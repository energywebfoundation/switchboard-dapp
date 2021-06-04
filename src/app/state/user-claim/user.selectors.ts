import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, USER_FEATURE_KEY } from './user.reducer';
import { Profile } from 'iam-client-lib';

// Lookup the 'User' feature state managed by NgRx
export const getUserState = createFeatureSelector<State>(USER_FEATURE_KEY);

export const getUserProfile = createSelector(
  getUserState,
  (state: State) => state.profile
);

export const getUserName = createSelector(
  getUserProfile,
  (state: Profile) => state ? state.name : ''
);

export const getDid = createSelector(
  getUserState,
  (state: State) => state?.didDocument?.id
);
