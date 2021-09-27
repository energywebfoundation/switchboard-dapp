import { createAction, props } from '@ngrx/store';
import { Filters } from '../models/filters';
import { IRole } from 'iam-client-lib';

export const getList = createAction(
  '[ROLE] Get Role List'
);

export const getListSuccess = createAction(
  '[ROLE] Get Role List Success',
  props<{ list: IRole[] }>()
);

export const getListFailure = createAction(
  '[ROLE] Get Role List Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[ROLE] Update Filters',
  props<{ filters: Filters }>()
);

export const clearFilters = createAction(
  '[ROLE] Clear Filters',
);
