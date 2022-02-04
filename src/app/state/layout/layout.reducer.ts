import { Action, createReducer, on } from '@ngrx/store';
import * as LayoutActions from './layout.actions';

export const USER_FEATURE_KEY = 'layout';

export interface LayoutState {
  redirectUrl: string;
}

export const initialState: LayoutState = {
  redirectUrl: '',
};

const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.setRedirectUrl, (state, { url }) => ({
    ...state,
    redirectUrl: url,
  })),
  on(LayoutActions.redirectSuccess, (state) => ({ ...state, redirectUrl: '' }))
);

export function reducer(state: LayoutState | undefined, action: Action) {
  return layoutReducer(state, action);
}
