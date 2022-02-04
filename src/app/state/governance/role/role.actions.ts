import { createAction, props } from '@ngrx/store';
import { Filters } from '../models/filters';
import { IRole } from 'iam-client-lib';

export const getList = createAction('[ROLE] Get Role List');

export const getListSuccess = createAction(
  '[ROLE] Get Role List Success',
  props<{ list: IRole[]; namespace: string }>()
);

export const getListFailure = createAction(
  '[ROLE] Get Role List Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[ROLE] Update Filters',
  props<{ filters: Filters; namespace: string }>()
);

export const toggleFilters = createAction('[ROLE] Toggle Filters');

export const showFilters = createAction('[ROLE] Show Filters');

export const cleanUpFilters = createAction('[ROLE] Clean Up Filters');
