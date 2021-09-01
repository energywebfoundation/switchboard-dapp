import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AssetDetailsState, USER_FEATURE_KEY } from './asset-details.reducer';
import { getAllAssetsClaim } from '../../user-claim/user.selectors';

export const getAssetDetailsState = createFeatureSelector<AssetDetailsState>(USER_FEATURE_KEY);

export const getAsset = createSelector(
  getAssetDetailsState,
  (state) => state?.asset
);

export const getAssetDetails = createSelector(
  getAsset,
  getAllAssetsClaim,
  (asset, assetsClaim) => {
    const claim = assetsClaim && assetsClaim[asset?.id];
    return {...asset, ...claim};
  }
);


