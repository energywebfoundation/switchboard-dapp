import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StakeState, USER_FEATURE_KEY } from './stake.reducer';

export const getStakeState =
  createFeatureSelector<StakeState>(USER_FEATURE_KEY);

export const getProviders = createSelector(
  getStakeState,
  (state) => state?.providers
);
