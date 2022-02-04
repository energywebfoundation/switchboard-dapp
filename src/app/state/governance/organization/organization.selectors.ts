import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrganizationState, USER_FEATURE_KEY } from './organization.reducer';

export const getOrganizationState =
  createFeatureSelector<OrganizationState>(USER_FEATURE_KEY);

export const getList = createSelector(
  getOrganizationState,
  (state) => state.history
);

export const getHierarchy = createSelector(
  getOrganizationState,
  (state) => state.hierarchy
);

export const getLastHierarchyOrg = createSelector(
  getHierarchy,
  (state) => state[state.length - 1]
);

export const getHierarchyLength = createSelector(
  getHierarchy,
  (hierarchy) => hierarchy.length
);

export const isSelectedOrgNotOwnedByUser = createSelector(
  getLastHierarchyOrg,
  (organization) => !organization.isOwnedByCurrentUser
);
