import { Action, createReducer, on } from '@ngrx/store';
import {
  cleanHierarchy,
  getListSuccess,
  setHistorySuccess,
} from './organization.actions';
import { getMainOrgs } from './utils/get-main-orgs';
import { getOrgHierarchy } from './utils/get-org-hierarchy';
import { OrganizationProvider } from './models/organization-provider.interface';
import { updateHistory } from './utils/update-history';

export const USER_FEATURE_KEY = 'organization';

export interface OrganizationState {
  list: OrganizationProvider[];
  history: OrganizationProvider[];
  hierarchy: OrganizationProvider[];
}

export const initialState: OrganizationState = {
  list: [],
  history: [],
  hierarchy: [],
};

const organizationReducer = createReducer(
  initialState,
  on(getListSuccess, (state, { list }) => {
    return {
      ...state,
      list: [...list],
      history: getMainOrgs(list),
    };
  }),
  on(setHistorySuccess, (state, { history, element }) => {
    return {
      ...state,
      history: updateHistory(state.list, history),
      hierarchy: getOrgHierarchy(state.hierarchy, element),
    };
  }),
  on(cleanHierarchy, (state) => ({
    ...state,
    hierarchy: [],
    history: getMainOrgs(state.list),
  }))
);

export function reducer(state: OrganizationState | undefined, action: Action) {
  return organizationReducer(state, action);
}
