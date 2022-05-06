import { Action, createReducer, on } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';
import { statusFilter } from '../utils/status-filter/status-filter';
import { filterByNamespace } from '../utils/filter-by-namespace/filter-by-namespace';
import { filterByDid } from '../utils/filter-by-did/filter-by-did';

export const USER_FEATURE_KEY = 'requested';

export interface RequestedState {
  enrolments: EnrolmentClaim[];
  filteredList: EnrolmentClaim[];
  status: FilterStatus;
  namespaceFilter: string;
  didFilter: string;
  error: string;
}

export const initialState: RequestedState = {
  enrolments: [],
  filteredList: [],
  status: FilterStatus.All,
  namespaceFilter: '',
  didFilter: '',
  error: null,
};

const requestedReducer = createReducer(
  initialState,
  on(
    RequestedActions.getEnrolmentRequestsSuccess,
    RequestedActions.updateEnrolmentRequestsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
      filteredList: filter(enrolments, state, state.status),
    })
  ),
  on(RequestedActions.changeFilterStatus, (state, { status }) => {
    return {
      ...state,
      status,
      filteredList: filter(state.enrolments, state, status),
    };
  }),
  on(RequestedActions.changeNamespaceFilter, (state, { value }) => {
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
  { enrolments, didFilter, namespaceFilter }: RequestedState,
  status: FilterStatus
) => {
  return statusFilter(
    filterByNamespace(filterByDid(list, didFilter), namespaceFilter),
    status
  );
};

export function reducer(state: RequestedState | undefined, action: Action) {
  return requestedReducer(state, action);
}
