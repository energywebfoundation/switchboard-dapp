import { createAction } from '@ngrx/store';

export const enableExperimental = createAction(
  '[SETTINGS] Enable Experimental Features'
);

export const disableExperimental = createAction(
  '[SETTINGS] Disable Experimental Features'
);
