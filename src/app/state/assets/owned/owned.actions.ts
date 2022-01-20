import { createAction, props } from '@ngrx/store';
import { OwnedAsset } from './models/owned-asset';

export const getOwnedAssets = createAction('[OWNED ASSETS] Get Owned Assets');

export const getOwnedAssetsSuccess = createAction(
  '[OWNED ASSETS] Get Owned Assets Success',
  props<{ assets: OwnedAsset[] }>()
);

export const getOwnedAssetsFailure = createAction(
  '[OWNED ASSETS] Get Owned Assets Failure',
  props<{ error: string }>()
);
