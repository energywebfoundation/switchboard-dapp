import { Action, createReducer, on } from '@ngrx/store';
import * as RevokableActions from './revokable.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import * as RequestedActions from '../requested/requested.actions';

export const USER_FEATURE_KEY = 'revokable';

export interface RevokableState {
  enrolments: EnrolmentClaim[];
}

export const initialState: RevokableState = {
  enrolments: [],
};

const revokableReducer = createReducer(
  initialState,
  on(
    RevokableActions.getRevocableEnrolmentsSuccess,
    RevokableActions.updateRevocableEnrolmentsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
    })
  ),
  on(RevokableActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    enrolments: state.enrolments.map((e) =>
      e.id === enrolment.id ? enrolment : e
    ),
  }))
);

export function reducer(state: RevokableState | undefined, action: Action) {
  return revokableReducer(state, action);
}
