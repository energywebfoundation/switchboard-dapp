import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PoolState, USER_FEATURE_KEY } from './pool.reducer';
import { Stake, StakeStatus } from 'iam-client-lib';
import { utils } from 'ethers';
import { MAX_STAKE_AMOUNT } from './models/const';

const {formatEther} = utils;

export const getStakeState = createFeatureSelector<PoolState>(USER_FEATURE_KEY);

export const getReward = createSelector(
  getStakeState,
  (state: PoolState) => formatEther(state.reward)
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

export const isWithdrawDisabled = createSelector(
  getStake,
  (state: Stake) => state?.status !== StakeStatus.STAKING
);

export const getStakeAmount = createSelector(
  getStake,
  (state: Stake) => state?.amount ? formatEther(state.amount) : '0'
);

export const getMaxPossibleAmountToStake = createSelector(
  getStake,
  getStakeState,
  (stake: Stake, state: PoolState) => {
    if (!state.contributorLimit) {
      return MAX_STAKE_AMOUNT;
    }
    const maxValue = +formatEther(state.contributorLimit);
    if (!stake?.amount) {
      return maxValue;
    }
    const puttedStake = +formatEther(stake.amount);
    return maxValue - puttedStake;
  }
);

export const isWithdrawingDelayFinished = createSelector(
  getStakeState,
  (state: PoolState) => state.withdrawing
);

export const getOrganizationDetails = createSelector(
  getStakeState,
  (state: PoolState) => state?.organizationDetails
);

export const getOrganizationLimit = createSelector(
  getStakeState,
  (state: PoolState) => {
    return state?.organizationLimit?.toString();
  }
);

export const getContributorLimit = createSelector(
  getStakeState,
  (state: PoolState) => {
    if (state.contributorLimit) {
      return formatEther(state.contributorLimit);
    }
    return state.contributorLimit;
  }
);

export const allTokens = createSelector(
  getStakeState,
  (state: PoolState) => {
    return formatEther(state?.userStake?.amount?.add(state?.reward));
  }
);

export const expirationDate = createSelector(
  getStakeState,
  (state: PoolState) => {
    return new Date(state?.endDate * 1000);
  }
);
