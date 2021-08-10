import { Action, createReducer, on } from '@ngrx/store';
import * as StakeActions from './stake.actions';
import { Provider } from './models/provider.interface';

export const USER_FEATURE_KEY = 'stake';

export interface StakeState {
  providers: Provider[];
}

export const initialState: StakeState = {
  providers: []
};

const stakeReducer = createReducer(
  initialState,
  on(StakeActions.getAllServicesSuccess, (state, {providers}) => ({...state, providers}))
);

export function reducer(state: StakeState | undefined, action: Action) {
  return stakeReducer(state, action);
}
