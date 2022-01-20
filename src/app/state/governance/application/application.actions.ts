import { createAction, props } from '@ngrx/store';
import { Filters } from '../models/filters';
import { IApp } from 'iam-client-lib';

export const getList = createAction('[APP] Get Application List');

export const getListSuccess = createAction(
  '[APP] Get Application List Success',
  props<{ list: IApp[]; namespace: string }>()
);

export const getListFailure = createAction(
  '[APP] Get Application List Failure',
  props<{ error: string }>()
);

export const updateFilters = createAction(
  '[APP] Update Filters',
  props<{ filters: Filters; namespace: string }>()
);

export const toggleFilters = createAction('[APP] Toggle Filters');

export const showFilters = createAction('[APP] Show Filters');

export const cleanUpFilters = createAction('[APP] Clean Up Filters');
