import { createReducer, on, Action } from '@ngrx/store';
import * as StakeActions from './stake.actions';
import { setOrganization } from './stake.actions';

export const USER_FEATURE_KEY = 'stake';

export interface StakeState {
  balance: string;
  performance: number;
  annualReward: number;
  reward: number;
  organization: string;
}

export const initialState: StakeState = {
  balance: null,
  performance: 100,
  annualReward: 10,
  reward: null,
  organization: 'dawidgil.iam.ewc'
};

const stakeReducer = createReducer(
  initialState,
  on(StakeActions.checkRewardSuccess, (state, {reward}) => ({...state, reward})),
  on(StakeActions.getAccountSuccess, (state, {balance}) => ({...state, balance})),
  on(StakeActions.setOrganization, (state, {organization}) => ({...state, organization}))
);

export function reducer(state: StakeState | undefined, action: Action) {
  return stakeReducer(state, action);
}
