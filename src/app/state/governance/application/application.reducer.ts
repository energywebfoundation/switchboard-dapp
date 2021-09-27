import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationActions from './application.actions';
import { filterBy } from '../utils/filter-by/filter-by';
import { Filters } from '../models/filters';
import { IApp } from 'iam-client-lib';

export const USER_FEATURE_KEY = 'application';


export interface ApplicationState {
  list: IApp[];
  filteredList: IApp[];
  filters: Filters;
  filterVisible: boolean;
}

export const initialState: ApplicationState = {
  list: [],
  filteredList: [],
  filters: {
    organization: '',
    application: '',
    role: ''
  },
  filterVisible: false
};

const applicationReducer = createReducer(
  initialState,
  on(ApplicationActions.getListSuccess, (state, {list}) => ({
    ...state,
    list,
    filteredList: filterBy(list, state.filters.organization, state.filters.application, state.filters.role)
  })),

  on(ApplicationActions.updateFilters, (state, {filters}) => ({
    ...state,
    filters,
    filteredList: filterBy(state.list, filters.organization, filters.application, filters.role)
  })),
  on(ApplicationActions.toggleFilters, (state) => ({...state, filterVisible: !state.filterVisible})),
  on(ApplicationActions.cleanUpFilters, (state) => ({
    ...state,
    ...clearFilters(state),
    filterVisible: false
  }))
);


export const clearFilters = (state) => ({
  filters: {
    organization: '',
    application: '',
    role: ''
  },
  filteredList: state.list
});

export function reducer(state: ApplicationState | undefined, action: Action) {
  return applicationReducer(state, action);
}
