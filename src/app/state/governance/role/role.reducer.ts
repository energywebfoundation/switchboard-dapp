import { Action, createReducer, on } from '@ngrx/store';
import * as RoleActions from './role.actions';
import { IRole } from 'iam-client-lib';

export const USER_FEATURE_KEY = 'role';

export interface RoleState {
  list: IRole[];
}

export const initialState: RoleState = {
  list: [],
};

const roleReducer = createReducer(
  initialState,
  on(RoleActions.getListSuccess, (state, { list, namespace }) => ({
    ...state,
    list: [...list],
  }))
);

export function reducer(state: RoleState | undefined, action: Action) {
  return roleReducer(state, action);
}
