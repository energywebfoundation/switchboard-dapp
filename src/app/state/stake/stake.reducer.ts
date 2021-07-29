import { Action, createReducer, on } from '@ngrx/store';
import * as StakeActions from './stake.actions';
import { Stake } from 'iam-client-lib';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';

export const USER_FEATURE_KEY = 'stake';

export interface StakeState {
  balance: string;
  performance: number;
  annualReward: number;
  reward: string;
  organization: string;
  userStake: Stake;
  withdrawing: boolean;
  organizationDetails: IOrganizationDefinition;
}

export const initialState: StakeState = {
  balance: '0',
  performance: 100,
  annualReward: 10,
  reward: '0',
  organization: '',
  userStake: null,
  withdrawing: false,
  organizationDetails: null
};

const stakeReducer = createReducer(
  initialState,
  on(StakeActions.checkRewardSuccess, (state, {reward}) => ({...state, reward})),
  on(StakeActions.getAccountSuccess, (state, {balance}) => ({...state, balance})),
  on(StakeActions.setOrganization, (state, {organization}) => ({...state, organization})),
  on(StakeActions.getStakeSuccess, (state, {stake}) => (
    {
      ...state,
      userStake: {
        amount: stake.amount,
        status: stake.status,
        depositEnd: stake.depositEnd,
        depositStart: stake.depositStart
      }
    })),
  on(StakeActions.withdrawRequest, (state) => ({...state, withdrawing: true})),
  on(StakeActions.withdrawalDelayExpired, (state) => ({...state, withdrawing: false})),
  on(StakeActions.getOrganizationDetailsSuccess, (state, {orgDetails}) => ({...state, organizationDetails: orgDetails}))
);

export function reducer(state: StakeState | undefined, action: Action) {
  return stakeReducer(state, action);
}
