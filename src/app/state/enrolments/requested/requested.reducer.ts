import { Action, createReducer, on } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../routes/enrolment/enrolment-list/enrolment-list-filter/enrolment-list-filter.component';
import { statusFilter } from '../utils/status-filter/status-filter';
import { filterByNamespace } from '../utils/filter-by-namespace/filter-by-namespace';
import { filterByDid } from '../utils/filter-by-did/filter-by-did';

export const USER_FEATURE_KEY = 'requested';

export interface RequestedState {
  enrolments: EnrolmentClaim[];
}

export const initialState: RequestedState = {
  enrolments: [],
};

const requestedReducer = createReducer(
  initialState,
  on(
    RequestedActions.getEnrolmentRequestsSuccess,
    RequestedActions.updateEnrolmentRequestsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
    })
  ),
);

export function reducer(state: RequestedState | undefined, action: Action) {
  return requestedReducer(state, action);
}
