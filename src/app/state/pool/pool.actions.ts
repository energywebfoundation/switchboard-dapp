import { createAction, props } from '@ngrx/store';
import { Stake } from 'iam-client-lib';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';

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

export const putStakeFailure = createAction(
  '[Stake] Put Stake Failure',
  props<{ err: string }>()
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

export const getOrganizationDetails = createAction(
  '[Stake] Get Organization Details'
);
export const getOrganizationDetailsSuccess = createAction(
  '[Stake] Get Organization Details Success',
  props<{ orgDetails: IOrganizationDefinition }>()
);
export const getOrganizationDetailsFailure = createAction(
  '[Stake] Get Organization Details Failure',
  props<{ err: string }>()
);
