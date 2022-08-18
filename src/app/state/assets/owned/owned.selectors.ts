import { createSelector } from '@ngrx/store';
import { getAllAssetsClaim } from '../../user-claim/user.selectors';
import { getAssetState } from '../assets.reducer';
import { USER_FEATURE_KEY } from './owned.reducer';
import { Asset } from 'iam-client-lib';

export const getOwnedState = createSelector(
  getAssetState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAssets = createSelector(
  getOwnedState,
  (state) => state?.assets
);

export const getAssetsWithSelection = (assetDID: string) =>
  createSelector(getOwnedState, (state) =>
    state?.assets.map((item: Asset) => ({
      ...item,
      isSelected: assetDID === item.id,
    }))
  );

export const getOwnedAssets = createSelector(
  getAssets,
  getAllAssetsClaim,
  (assets, assetsClaim) => {
    return assets?.map((asset) => ({
      ...asset,
      ...(assetsClaim && assetsClaim[asset.id]),
      hasEnrolments: true,
    }));
  }
);
