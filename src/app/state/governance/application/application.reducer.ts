import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationActions from './application.actions';
import { filterBy } from '../utils/filter-by/filter-by';
import { Filters } from '../models/filters';
import { IApp } from 'iam-client-lib';

export const USER_FEATURE_KEY = 'application';

export interface ApplicationState {
  list: IApp[];
}

export const initialState: ApplicationState = {
  list: [],
};

const applicationReducer = createReducer(
  initialState,
  on(ApplicationActions.getListSuccess, (state, { list }) => ({
    ...state,
    list: [...list],
  }))
);

export function reducer(state: ApplicationState | undefined, action: Action) {
  return applicationReducer(state, action);
}
