import { createAction, props } from '@ngrx/store';
import { IStakingPool } from '../../routes/applications/new-staking-pool/staking-pool.service';
import { Provider } from './models/provider.interface';

export const initStakingPool = createAction(
  '[Stake] Initialize Staking Pool Service'
);
export const initStakingPoolSuccess = createAction(
  '[Stake] Initialize Staking Pool Service Success'
);

export const launchStakingPool = createAction(
  '[Stake] Launch Staking Pool',
  props<{ pool: IStakingPool }>()
);

export const getAllServices = createAction('[Stake] Get All Services');

export const getAllServicesSuccess = createAction(
  '[Stake] Get All Services Success',
  props<{ providers: Provider[] }>()
);
