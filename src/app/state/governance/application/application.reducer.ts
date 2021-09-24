import { Action, createReducer } from '@ngrx/store';

export const USER_FEATURE_KEY = 'application';


export interface ApplicationState {
}

export const initialState: ApplicationState = {};

const applicationReducer = createReducer(
  initialState,
);

export function reducer(state: ApplicationState | undefined, action: Action) {
  return applicationReducer(state, action);
}
