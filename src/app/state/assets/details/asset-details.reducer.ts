import { Action, createReducer, on } from '@ngrx/store';
import * as AssetDetailsActions from './asset-details.actions';

export const USER_FEATURE_KEY = 'asset-details';

export interface AssetDetailsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset: any;
  error: string;
}

export const initialState: AssetDetailsState = {
  asset: null,
  error: null,
};

const assetDetailsReducer = createReducer(
  initialState,
  on(AssetDetailsActions.getDetailsSuccess, (state, { asset }) => ({
    ...state,
    asset,
  })),
  on(AssetDetailsActions.getDetailsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: AssetDetailsState | undefined, action: Action) {
  return assetDetailsReducer(state, action);
}
