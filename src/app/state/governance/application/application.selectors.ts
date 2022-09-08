import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState, USER_FEATURE_KEY } from './application.reducer';

export const getApplicationState =
  createFeatureSelector<ApplicationState>(USER_FEATURE_KEY);

export const getList = createSelector(
  getApplicationState,
  (state) => state.list
);
