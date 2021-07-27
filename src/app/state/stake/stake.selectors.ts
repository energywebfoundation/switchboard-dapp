import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StakeState, USER_FEATURE_KEY } from './stake.reducer';
import { Stake, StakeStatus } from 'iam-client-lib';
import { utils } from 'ethers';
import * as authSelectors from '../auth/auth.selectors';

const {formatEther} = utils;

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

export const getStake = createSelector(
  getStakeState,
  (state: StakeState) => state?.userStake
);

export const isStakingDisabled = createSelector(
  getStake,
  authSelectors.isUserLoggedIn,
  (state: Stake, loggedIn) => {
    return (state?.status === StakeStatus.STAKING || state?.status === StakeStatus.WITHDRAWING) && loggedIn
  }
);

export const isWithdrawDisabled = createSelector(
  getStake,
  (state: Stake) => state?.status !== StakeStatus.STAKING
);

export const getStakeAmount = createSelector(
  getStake,
  (state: Stake) => state?.amount ? formatEther(state.amount) : '0'
);

export const isWithdrawingDelayFinished = createSelector(
  getStakeState,
  (state: StakeState) => state.withdrawing
)
