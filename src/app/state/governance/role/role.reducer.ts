import { Action, createReducer, on } from '@ngrx/store';
import * as RoleActions from './role.actions';
import { filterBy } from '../utils/filter-by/filter-by';
import { IRole } from 'iam-client-lib';
import { Filters } from '../models/filters';

export const USER_FEATURE_KEY = 'role';


export interface RoleState {
  list: IRole[];
  filteredList: IRole[];
  filters: Filters;
}

export const initialState: RoleState = {
  list: [],
  filteredList: [],
  filters: {
    organization: '',
    application: '',
    role: ''
  }
};

const roleReducer = createReducer(
  initialState,
  on(RoleActions.getListSuccess, (state, {list}) => ({
    ...state,
    list,
    filteredList: filterBy(list, state.filters.organization, state.filters.application, state.filters.role)
  })),

  on(RoleActions.updateFilters, (state, {filters}) => ({
    ...state,
    filters,
    filteredList: filterBy(state.list, filters.organization, filters.application, filters.role)
  })),
  on(RoleActions.clearFilters, (state) => ({
    ...state,
    filters: {
      organization: '',
      application: '',
      role: ''
    },
    filteredList: state.list
  }))
);

export function reducer(state: RoleState | undefined, action: Action) {
  return roleReducer(state, action);
}
