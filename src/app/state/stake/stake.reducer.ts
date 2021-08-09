import { Action, createReducer, on } from '@ngrx/store';
import * as StakeActions from './stake.actions';
import { Service } from 'iam-client-lib/dist/src/staking';

export const USER_FEATURE_KEY = 'stake';

export interface StakeState {
  services: Service[];
}

export const initialState: StakeState = {
  services: []
};

const stakeReducer = createReducer(
  initialState,
  on(StakeActions.getAllServicesSuccess, (state, {services}) => ({...state, services}))
);

export function reducer(state: StakeState | undefined, action: Action) {
  return stakeReducer(state, action);
}
