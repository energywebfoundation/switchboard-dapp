import { createAction, props } from '@ngrx/store';

export const getList = createAction(
  '[ARBITRARY] Get List'
);

export const getListSuccess = createAction(
  '[ARBITRARY] Get List Success',
  props<{ list: any[] }>()
);

export const getListFailure = createAction(
  '[ARBITRARY] Get List Failure',
  props<{ error: string }>()
);


