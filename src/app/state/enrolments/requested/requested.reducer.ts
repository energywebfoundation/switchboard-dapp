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
  ),
  on(RequestedActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    enrolments: [
      ...state.enrolments.filter((e) => e.id !== enrolment.id),
      enrolment,
    ].filter(Boolean),
  })),
  on(RequestedActions.removeEnrolment, (state, { id }) => ({
    enrolments: state.enrolments.filter((e) => e.id !== id),
  }))
);

export function reducer(state: RequestedState | undefined, action: Action) {
  return requestedReducer(state, action);
}
