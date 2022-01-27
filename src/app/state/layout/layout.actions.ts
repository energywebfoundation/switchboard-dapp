import { createAction, props } from '@ngrx/store';

export const setRedirectUrl = createAction(
  '[LAYOUT] Set Redirect Url',
  props<{ url: string }>()
);

export const redirect = createAction('[LAYOUT] Redirect');
export const redirectSuccess = createAction('[LAYOUT] Redirect Success');
