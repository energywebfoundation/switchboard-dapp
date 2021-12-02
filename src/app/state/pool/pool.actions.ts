import { createAction, props } from '@ngrx/store';
import { Stake } from 'iam-client-lib';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';
import { BigNumber } from 'ethers';

export const initPool = createAction('[Pool] Initialize Pool');

export const checkReward = createAction('[Pool] Check Accumulated Reward');
export const checkRewardSuccess = createAction(
  '[Pool] Check Accumulated Reward Success',
  props<{ reward: BigNumber }>()
);
export const checkRewardFailure = createAction(
  '[Pool] Check Accumulated Reward Failure',
  props<{ error: string }>()
);

export const getStake = createAction('[Pool] Get Stake');
export const getStakeSuccess = createAction(
  '[Pool] Get Stake Success',
  props<{ stake: Stake }>()
);
export const getStakeFailure = createAction(
  '[Pool] Get Stake Failure'
);

export const getAccountBalance = createAction('[Pool] Get Actual Account Balance');
export const getAccountSuccess = createAction(
  '[Pool] Get Actual Account Balance Success',
  props<{ balance: string }>()
);

export const setOrganization = createAction(
  '[Pool] Set Organization For Pool',
  props<{ organization: string }>()
);
export const putStake = createAction(
  '[Pool] Put Stake',
  props<{ amount: string }>()
);

export const putStakeFailure = createAction(
  '[Pool] Put Stake Failure',
  props<{ err: string }>()
);

export const withdrawReward = createAction(
  '[Pool] Withdraw Reward',
  props<{ value: string }>()
);

export const withdrawAllReward = createAction(
  '[Pool] Withdraw All Reward'
);

export const withdrawRewardSuccess = createAction(
  '[Pool] Withdraw Reward Success'
);

export const withdrawRewardFailure = createAction(
  '[Pool] Withdraw Reward Failure',
  props<{ err: string }>()
);

export const getWithdrawalDelay = createAction(
  '[Pool] Get Delay After Calling Request Withdraw'
);

export const displayConfirmationDialog = createAction(
  '[Pool] Display Confirmation Dialog With Progress Bar'
);

export const withdrawalDelayExpired = createAction(
  '[Pool] Withdrawal Delay Expired',
);

export const getWithdrawalDelayFailure = createAction(
  '[Pool] Get Delay After Calling Request Withdraw Failure',
  props<{ err: string }>()
);

export const getOrganizationDetails = createAction(
  '[Pool] Get Organization Details'
);

export const openWithdrawDialog = createAction(
  '[Pool] Open Withdraw Dialog'
);

export const getHardCap = createAction(
  '[Pool] Get Hard Organization Limit'
);

export const getHardCapSuccess = createAction(
  '[Pool] Get Hard Organization Limit Success',
  props<{ cap: BigNumber }>()
);

export const getHardCapFailure = createAction(
  '[Pool] Get Hard Organization Limit Failure',
  props<{ err: string }>()
);
export const totalStaked = createAction(
  '[Pool] Get Total Staked Amount'
);

export const totalStakedSuccess = createAction(
  '[Pool] Get Total Staked Amount Success',
  props<{ cap: BigNumber }>()
);

export const totalStakedFailure = createAction(
  '[Pool] Get Total Staked Amount Failure',
  props<{ err: string }>()
);

export const getContributorLimit = createAction(
  '[Pool] Get Contributor Limit'
);

export const getContributorLimitSuccess = createAction(
  '[Pool] Get Contributor Limit Success',
  props<{ cap: BigNumber }>()
);

export const stakingPoolFinishDate = createAction(
  '[Pool] Get Staking Pool Finish Date'
);

export const stakingPoolFinishDateSuccess = createAction(
  '[Pool] Get Staking Pool Finish Date Success',
  props<{ date: number }>()
);
export const stakingPoolStartDate = createAction(
  '[Pool] Get Staking Pool Start Date'
);

export const stakingPoolStartDateSuccess = createAction(
  '[Pool] Get Staking Pool Start Date Success',
  props<{ date: number }>()
);

export const getContributorLimitFailure = createAction(
  '[Pool] Get Contributor Limit Failure',
  props<{ err: string }>()
);

export const getOrganizationDetailsSuccess = createAction(
  '[Pool] Get Organization Details Success',
  props<{ orgDetails: IOrganizationDefinition }>()
);
export const getOrganizationDetailsFailure = createAction(
  '[Pool] Get Organization Details Failure',
  props<{ err: string }>()
);
