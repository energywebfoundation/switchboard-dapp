import { Action, createReducer, on } from '@ngrx/store';
import * as AssetDetailsActions from './asset-details.actions';

export const USER_FEATURE_KEY = 'asset-details';

export interface AssetDetailsState {
  asset: any;
}

export const initialState: AssetDetailsState = {
  asset: null
};

const assetDetailsReducer = createReducer(
  initialState,
  on(AssetDetailsActions.getDetailsSuccess, (state, {asset}) => ({...state, asset})),
);

export function reducer(state: AssetDetailsState | undefined, action: Action) {
  return assetDetailsReducer(state, action);
}
