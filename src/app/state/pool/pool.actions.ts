import { createAction, props } from '@ngrx/store';
import { Stake } from 'iam-client-lib';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';
import { BigNumber } from 'ethers';

export const initPool = createAction('[Pool] Initialize Pool');

export const checkReward = createAction('[Pool] Check Accumulated Reward');
export const checkRewardSuccess = createAction(
  '[Pool] Check Accumulated Reward Success',
  props<{ reward: string }>()
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

export const withdrawRequest = createAction(
  '[Pool] Withdraw Request Reward'
);

export const withdrawRequestSuccess = createAction(
  '[Pool] Withdraw Request Reward Success'
);

export const withdrawRequestFailure = createAction(
  '[Pool] Withdraw Request Reward Failure',
  props<{ err: string }>()
);

export const withdrawReward = createAction(
  '[Pool] Withdraw Reward'
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

export const getContributorLimit = createAction(
  '[Pool] Get Contributor Limit'
);

export const getContributorLimitSuccess = createAction(
  '[Pool] Get Contributor Limit Success',
  props<{ cap: BigNumber }>()
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
