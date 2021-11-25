import { createAction, props } from '@ngrx/store';
import { Asset } from 'iam-client-lib';

export const getOwnedAssets = createAction(
  '[OWNED ASSETS] Get Owned Assets',
);

export const getOwnedAssetsSuccess = createAction(
  '[OWNED ASSETS] Get Owned Assets Success',
  props<{ assets: Asset[] }>()
);

export const getOwnedAssetsFailure = createAction(
  '[OWNED ASSETS] Get Owned Assets Failure',
  props<{ error: string }>()
);

