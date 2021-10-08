import * as assetDetails from './details/asset-details.reducer';
import { AssetDetailsState } from './details/asset-details.reducer';
import { createFeatureSelector } from '@ngrx/store';

export const USER_FEATURE_KEY = 'assets';

export interface AssetsState {
  [assetDetails.USER_FEATURE_KEY]: AssetDetailsState;
}

export const getAssetState = createFeatureSelector<AssetsState>(USER_FEATURE_KEY);

export const reducer = {
  [assetDetails.USER_FEATURE_KEY]: assetDetails.reducer
};
