import { createAction, props } from '@ngrx/store';

export const createSub = createAction(
  '[ORG] Create Sub Organization',
  props<{ org: string }>()
);
