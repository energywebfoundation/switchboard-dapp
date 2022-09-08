import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoleState, USER_FEATURE_KEY } from './role.reducer';

export const getRoleState = createFeatureSelector<RoleState>(USER_FEATURE_KEY);

export const getList = createSelector(getRoleState, (state) => state.list);
