import { createAction, props } from '@ngrx/store';
import { Stake } from 'iam-client-lib';
import { IStakingPool } from '../../routes/applications/new-staking-pool/staking-pool.service';

export const initStakingPool = createAction('[Stake] Initialize Staking Pool Service');
export const initStakingPoolSuccess = createAction('[Stake] Initialize Staking Pool Service Success');
export const initOnlyStakingPoolService = createAction('[Stake] Init Only Staking Pool Service');
export const initPool = createAction('[Stake] Initialize Pool');

export const checkReward = createAction('[Stake] Check Accumulated Reward');
export const checkRewardSuccess = createAction(
  '[Stake] Check Accumulated Reward Success',
  props<{ reward: string }>()
);
export const checkRewardFailure = createAction(
  '[Stake] Check Accumulated Reward Failure',
  props<{ error: string }>()
);

export const getStake = createAction('[Stake] Get Stake');
export const getStakeSuccess = createAction(
  '[Stake] Get Stake Success',
  props<{ stake: Stake }>()
);
export const getStakeFailure = createAction(
  '[Stake] Get Stake Failure'
);

export const getAccountBalance = createAction('[Stake] Get Actual Account Balance');
export const getAccountSuccess = createAction(
  '[Stake] Get Actual Account Balance Success',
  props<{ balance: string }>()
);

export const setOrganization = createAction(
  '[Stake] Set Organization For Pool',
  props<{ organization: string }>()
);
export const putStake = createAction(
  '[Stake] Put Stake',
  props<{ amount: string }>()
);

export const withdrawRequest = createAction(
  '[Stake] Withdraw Request Reward'
);

export const withdrawRequestSuccess = createAction(
  '[Stake] Withdraw Request Reward Success'
);

export const withdrawRequestFailure = createAction(
  '[Stake] Withdraw Request Reward Failure',
  props<{ err: string }>()
);

export const withdrawReward = createAction(
  '[Stake] Withdraw Reward'
);

export const withdrawRewardSuccess = createAction(
  '[Stake] Withdraw Reward Success'
);

export const withdrawRewardFailure = createAction(
  '[Stake] Withdraw Reward Failure',
  props<{ err: string }>()
);

export const launchStakingPool = createAction(
  '[Stake] Launch Staking Pool',
  props<{ pool: IStakingPool }>()
);

export const getAllServices = createAction(
  '[Stake] Get All Services'
);

export const getWithdrawalDelay = createAction(
  '[Stake] Get Delay After Calling Request Withdraw'
);

export const displayConfirmationDialog = createAction(
  '[Stake] Display Confirmation Dialog With Progress Bar'
);

export const withdrawalDelayExpired = createAction(
  '[Stake] Withdrawal Delay Expired',
);

export const getWithdrawalDelayFailure = createAction(
  '[Stake] Get Delay After Calling Request Withdraw Failure',
  props<{ err: string }>()
);
