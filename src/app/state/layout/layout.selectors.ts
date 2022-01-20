import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState, USER_FEATURE_KEY } from './layout.reducer';

export const getLayoutState =
  createFeatureSelector<LayoutState>(USER_FEATURE_KEY);

export const getRedirectUrl = createSelector(
  getLayoutState,
  (state) => state.redirectUrl
);
