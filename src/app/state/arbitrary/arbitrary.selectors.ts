import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArbitraryState, USER_FEATURE_KEY } from './arbitrary.reducer';

export const getArbitraryState = createFeatureSelector<ArbitraryState>(USER_FEATURE_KEY);

export const getList = createSelector(
  getArbitraryState,
  (state) => state.list
);
