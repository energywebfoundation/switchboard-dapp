import { createAction, props } from '@ngrx/store';
import { OrganizationProvider } from './models/organization-provider.interface';

export const getList = createAction('[ORG] Get Organization List');

export const getListSuccess = createAction(
  '[ORG] Get Organization List Success',
  props<{ list: OrganizationProvider[] }>()
);

export const getListFailure = createAction(
  '[ORG] Get Organization List Failure',
  props<{ error: string }>()
);

export const setHistory = createAction(
  '[ORG] Set Organization History',
  props<{ element: OrganizationProvider }>()
);

export const setHistorySuccess = createAction(
  '[ORG] Set Organization History Success',
  props<{ history: OrganizationProvider[]; element: OrganizationProvider }>()
);

export const setHistoryFailure = createAction(
  '[ORG] Set Organization History Failure',
  props<{ error: string }>()
);

export const createSub = createAction(
  '[ORG] Create Sub Organization',
  props<{ org: OrganizationProvider }>()
);

export const createSubForParent = createAction(
  '[ORG] Create Sub Organization For Parent'
);

export const cleanHierarchy = createAction('[ORG] Clean Hierarchy List');

export const updateSelectedOrgAfterEdit = createAction(
  '[ORG] Update Selected Organization History After Edit'
);

export const updateSelectedOrgAfterTransfer = createAction(
  '[ORG] Update Selected Organization History After Transfer'
);

export const updateSelectedOrgAfterRemoval = createAction(
  '[ORG] Update Selected Organization History After Removal'
);
