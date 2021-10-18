import { Action, createReducer } from '@ngrx/store';

export const USER_FEATURE_KEY = 'arbitrary';

export interface ArbitraryState {
  list: any[];
}

export const initialState: ArbitraryState = {
  list: []
};

const arbitraryReducer = createReducer(
  initialState,
);

export function reducer(state: ArbitraryState | undefined, action: Action) {
  return arbitraryReducer(state, action);
}
