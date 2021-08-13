import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PoolState, USER_FEATURE_KEY } from './pool.reducer';
import { Stake, StakeStatus } from 'iam-client-lib';
import { utils } from 'ethers';

const {formatEther} = utils;

export const getStakeState = createFeatureSelector<PoolState>(USER_FEATURE_KEY);

export const getReward = createSelector(
  getStakeState,
  (state: PoolState) => state.reward
);

export const getBalance = createSelector(
  getStakeState,
  (state: PoolState) => state?.balance
);

export const getPerformance = createSelector(
  getStakeState,
  (state: PoolState) => state.performance
);

export const getOrganization = createSelector(
  getStakeState,
  (state: PoolState) => state?.organization
);

export const getAnnualReward = createSelector(
  getStakeState,
  (state: PoolState) => state.annualReward
);

export const getStake = createSelector(
  getStakeState,
  (state: PoolState) => state?.userStake
);

export const isStakingDisabled = createSelector(
  getStake,
  (state: Stake) => state?.status === StakeStatus.STAKING || state?.status === StakeStatus.WITHDRAWING
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
  (state: PoolState) => state.withdrawing
);

export const getOrganizationDetails = createSelector(
  getStakeState,
  (state: PoolState) => state?.organizationDetails
);
