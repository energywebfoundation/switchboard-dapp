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
  filterVisible: boolean;

}

export const initialState: RoleState = {
  list: [],
  filteredList: [],
  filters: {
    organization: '',
    application: '',
    role: ''
  },
  filterVisible: false,
};

const roleReducer = createReducer(
  initialState,
  on(RoleActions.getListSuccess, (state, {list, namespace}) => ({
    ...state,
    list: [...list],
    filteredList: filterBy([...list], state.filters.organization, state.filters.application, state.filters.role, namespace)
  })),

  on(RoleActions.updateFilters, (state, {filters, namespace}) => ({
    ...state,
    filters: {...filters},
    filteredList: filterBy(state.list, filters.organization, filters.application, filters.role, namespace)
  })),
  on(RoleActions.toggleFilters, (state) => ({...state, filterVisible: !state.filterVisible})),
  on(RoleActions.showFilters, (state) => ({...state, filterVisible: true})),
  on(RoleActions.cleanUpFilters, (state) => ({
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


export function reducer(state: RoleState | undefined, action: Action) {
  return roleReducer(state, action);
}
