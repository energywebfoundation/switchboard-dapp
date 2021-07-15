import { createAction, props } from '@ngrx/store';
import { ClaimData } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { IServiceEndpoint } from '@ew-did-registry/did-resolver-interface';
import { Profile } from 'iam-client-lib';

export const initStakingPool = createAction('[Stake] Initialize Staking Pool Service');
export const initStakingPoolSuccess = createAction('[Stake] Initialize Staking Pool Service Success');

export const checkReward = createAction('[Stake] Check Accumulated Reward');
export const checkRewardSuccess = createAction(
  '[Stake] Check Accumulated Reward Success',
  props<{ reward: number }>()
);


export const getAccountBalance = createAction('[Stake] Get Actual Account Balance');
export const getAccountSuccess = createAction(
  '[Stake] Get Actual Account Balance Success',
  props<{ balance: string }>()
);

export const setOrganization = createAction(
  '[Stake] Set Organization For Pool',
  props<{organization: string}>()
);
export const putStake = createAction(
  '[Stake] Stake To Service',
  props<{amount: string}>()
);

export const withdrawReward = createAction(
  '[Stake] Withdraw Reward'
);

export const withdrawRewardSuccess = createAction(
  '[Stake] Withdraw Reward Success'
);

