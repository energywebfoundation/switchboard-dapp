import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState, USER_FEATURE_KEY } from './application.reducer';

export const getApplicationState =
  createFeatureSelector<ApplicationState>(USER_FEATURE_KEY);

export const getFilteredList = createSelector(
  getApplicationState,
  (state) => state.filteredList
);

export const getFilters = createSelector(
  getApplicationState,
  (state) => state.filters
);

export const isFilterVisible = createSelector(
  getApplicationState,
  (state) => state.filterVisible
);
