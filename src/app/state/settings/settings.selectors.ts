import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState, USER_FEATURE_KEY } from './settings.reducer';

export const getSettingsState =
  createFeatureSelector<SettingsState>(USER_FEATURE_KEY);

export const isExperimentalEnabled = createSelector(
  getSettingsState,
  (state) => state.experimentalEnabled
);
