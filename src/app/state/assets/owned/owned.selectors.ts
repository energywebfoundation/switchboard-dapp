import { createSelector } from '@ngrx/store';
import { getAllAssetsClaim } from '../../user-claim/user.selectors';
import { getAssetState } from '../assets.reducer';
import { USER_FEATURE_KEY } from './owned.reducer';

export const getOwnedState = createSelector(
  getAssetState,
  state => state && state[USER_FEATURE_KEY]
);

export const getAsset = createSelector(
  getOwnedState,
  (state) => state?.assets
);

export const getAssets = createSelector(
  getAsset,
  getAllAssetsClaim,
  (assets, assetsClaim) => {
    debugger;
    console.log(assetsClaim);
    console.log(assets?.map((asset) => ({
      ...asset,
      ...(assetsClaim && assetsClaim[asset.id]),
      hasEnrolments: true
    })));
    return assets?.map((asset) => ({
      ...asset,
      ...(assetsClaim && assetsClaim[asset.id]),
      hasEnrolments: true
    }));
  }
);


