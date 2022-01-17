import { createAction, props } from '@ngrx/store';

export const getDetails = createAction(
  '[ASSET DETAILS] Get Asset Details',
  props<{ assetId: string }>()
);

export const getDetailsSuccess = createAction(
  '[ASSET DETAILS] Get Asset Details Success',
  props<{ asset }>()
);

export const getDetailsFailure = createAction(
  '[ASSET DETAILS] Get Asset Details Failure',
  props<{ error: string }>()
);
