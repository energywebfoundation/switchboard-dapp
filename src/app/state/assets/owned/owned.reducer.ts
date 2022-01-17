import { Action, createReducer, on } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { OwnedAsset } from './models/owned-asset';

export const USER_FEATURE_KEY = 'owned';

export interface OwnedState {
  assets: OwnedAsset[];
  error: string;
}

export const initialState: OwnedState = {
  assets: [],
  error: null,
};

const ownedReducer = createReducer(
  initialState,
  on(OwnedActions.getOwnedAssetsSuccess, (state, { assets }) => ({
    ...state,
    assets,
  }))
);

export function reducer(state: OwnedState | undefined, action: Action) {
  return ownedReducer(state, action);
}
