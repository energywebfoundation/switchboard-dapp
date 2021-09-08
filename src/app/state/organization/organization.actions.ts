import { createAction, props } from '@ngrx/store';

export const getList = createAction(
  '[ORG] Get Organization List'
);

export const getListSuccess = createAction(
  '[ORG] Get Organization List Success',
  props<{ list: any }>()
);

export const getListFailure = createAction(
  '[ORG] Get Organization List Failure',
  props<{ error: string }>()
);

export const setHistory = createAction(
  '[ORG] Set Organization History',
  props<{ element: any }>()
);

export const setHistorySuccess = createAction(
  '[ORG] Set Organization History Success',
  props<{ history: any[], element: any }>()
);

export const setHistoryFailure = createAction(
  '[ORG] Set Organization History Failure',
  props<{ error: string }>()
);

export const createSub = createAction(
  '[ORG] Create Sub Organization',
  props<{ org: any }>()
);

export const cleanHierarchy = createAction(
  '[ORG] Clean Hierarchy List',
);

export const backToInHierarchy = createAction(
  '[ORG] Back To Organization In Hierarchy',
  props<{ id: number }>()
);
