import * as assetDetails from './details/asset-details.reducer';
import * as owned from './owned/owned.reducer';
import { createFeatureSelector } from '@ngrx/store';

export const USER_FEATURE_KEY = 'assets';

export interface AssetsState {
  [assetDetails.USER_FEATURE_KEY]: assetDetails.AssetDetailsState;
  [owned.USER_FEATURE_KEY]: owned.OwnedState;
}

export const getAssetState =
  createFeatureSelector<AssetsState>(USER_FEATURE_KEY);

export const reducer = {
  [assetDetails.USER_FEATURE_KEY]: assetDetails.reducer,
  [owned.USER_FEATURE_KEY]: owned.reducer,
};
