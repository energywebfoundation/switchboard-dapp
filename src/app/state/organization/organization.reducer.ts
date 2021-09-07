import { Provider } from '../stake/models/provider.interface';
import { Action, createReducer, on } from '@ngrx/store';
import { cleanHierarchy, getListSuccess, setHistorySuccess } from './organization.actions';
import { IOrganization } from 'iam-client-lib';
import { getMainOrgs } from './utils/get-main-orgs';
import { getOrgHierarchy } from './utils/get-org-hierarchy';

export const USER_FEATURE_KEY = 'organization';

export interface OrgList extends Provider, IOrganization {
  isProvider: boolean;
}

export interface OrganizationState {
  list: OrgList[];
  history: OrgList[];
  hierarchy: OrgList[];
}

export const initialState: OrganizationState = {
  list: [],
  history: [],
  hierarchy: []
};

const organizationReducer = createReducer(
  initialState,
  on(getListSuccess, (state, {list}) => {
    return {
      ...state,
      list,
      history: getMainOrgs(list)
    };
  }),
  on(setHistorySuccess, (state, {history, element}) => {
    return {...state, history, hierarchy: getOrgHierarchy(state.hierarchy, element)};
  }),
  on(cleanHierarchy, (state) => ({...state, hierarchy: [], history: getMainOrgs(state.list)}))
);

export function reducer(state: OrganizationState | undefined, action: Action) {
  return organizationReducer(state, action);
}
