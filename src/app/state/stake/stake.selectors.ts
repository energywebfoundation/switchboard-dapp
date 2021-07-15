import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StakeState, USER_FEATURE_KEY } from './stake.reducer';

export const getStakeState = createFeatureSelector<StakeState>(USER_FEATURE_KEY);

export const getReward = createSelector(
  getStakeState,
  (state: StakeState) => state.reward
);

export const getBalance = createSelector(
  getStakeState,
  (state: StakeState) => state?.balance
);

export const getPerformance = createSelector(
  getStakeState,
  (state: StakeState) => state.performance
);

export const getOrganization = createSelector(
  getStakeState,
  (state: StakeState) => state?.organization
);

export const getAnnualReward = createSelector(
  getStakeState,
  (state: StakeState) => state.annualReward
);


