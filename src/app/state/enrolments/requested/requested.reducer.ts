import { Action, createReducer, on } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

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
  )
);

export function reducer(state: RequestedState | undefined, action: Action) {
  return requestedReducer(state, action);
}
