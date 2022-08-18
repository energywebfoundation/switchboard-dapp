import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USER_FEATURE_KEY, UserClaimState } from './user.reducer';
import { Profile } from 'iam-client-lib';
import { userLocalStorage } from '../../shared/utils/local-storage-wrapper';

export const getUserState =
  createFeatureSelector<UserClaimState>(USER_FEATURE_KEY);

export const getUserProfile = createSelector(
  getUserState,
  (state: UserClaimState) => state?.profile
);

export const getUserData = createSelector(getUserState, (state) =>
  userLocalStorage.has
    ? userLocalStorage.parsed[state?.didDocument?.id]
    : state?.userData
);

export const getUserName = createSelector(getUserData, (state) =>
  state?.name ? state.name : ''
);

export const getAllAssetsClaim = createSelector(
  getUserProfile,
  (state: Profile) => state?.assetProfiles
);

export const getAssetProfile = (profileId: string) =>
  createSelector(
    getUserProfile,
    (state: Profile) => state?.assetProfiles && state.assetProfiles[profileId]
  );

export const getDid = createSelector(
  getUserState,
  (state: UserClaimState) => state?.didDocument?.id
);

export const getDIDDocument = createSelector(
  getUserState,
  (state: UserClaimState) => state?.didDocument
);
