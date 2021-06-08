import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserClaimState, USER_FEATURE_KEY } from './user.reducer';
import { Profile } from 'iam-client-lib';

export const getUserState = createFeatureSelector<UserClaimState>(USER_FEATURE_KEY);

export const getUserProfile = createSelector(
  getUserState,
  (state: UserClaimState) => state?.profile
);

export const getUserName = createSelector(
  getUserProfile,
  (state: Profile) => state?.name ? state.name : ''
);

export const getDid = createSelector(
  getUserState,
  (state: UserClaimState) => state?.didDocument?.id
);
