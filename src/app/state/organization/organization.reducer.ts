import { Provider } from '../stake/models/provider.interface';
import { Action, createReducer } from '@ngrx/store';

export const USER_FEATURE_KEY = 'organization';

export interface OrganizationState {
  providers: Provider[];
}

export const initialState: OrganizationState = {
  providers: []
};

const organizationReducer = createReducer(
  initialState,
);

export function reducer(state: OrganizationState | undefined, action: Action) {
  return organizationReducer(state, action);
}
