import { Action, createReducer, on } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../routes/enrolment/enrolment-list/enrolment-list-filter/enrolment-list-filter.component';
import { filterByNamespace } from '../utils/filter-by-namespace/filter-by-namespace';
import { statusFilter } from '../utils/status-filter/status-filter';

export const USER_FEATURE_KEY = 'owned';

export interface OwnedState {
  enrolments: EnrolmentClaim[];
  filteredList: EnrolmentClaim[];
  status: FilterStatus;
  namespaceFilter: string;
  error: string;
}

export const initialState: OwnedState = {
  enrolments: [],
  filteredList: [],
  status: FilterStatus.Pending,
  namespaceFilter: '',
  error: null,
};

const ownedReducer = createReducer(
  initialState,
  on(
    OwnedActions.getOwnedEnrolmentsSuccess,
    OwnedActions.updateOwnedEnrolmentsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
      filteredList: filter(enrolments, state, state.status),
    })
  ),
  on(OwnedActions.changeFilterStatus, (state, { status }) => {
    return {
      ...state,
      status,
      filteredList: filter(state.enrolments, state, status),
    };
  }),
  on(OwnedActions.changeNamespaceFilter, (state, { value }) => {
    return {
      ...state,
      filteredList: filter(
        state.enrolments,
        { ...state, namespaceFilter: value },
        state.status
      ),
    };
  })
);

const filter = (
  list: EnrolmentClaim[],
  { enrolments, namespaceFilter }: OwnedState,
  status: FilterStatus
) => {
  return statusFilter(filterByNamespace(list, namespaceFilter), status);
};

export function reducer(state: OwnedState | undefined, action: Action) {
  return ownedReducer(state, action);
}
