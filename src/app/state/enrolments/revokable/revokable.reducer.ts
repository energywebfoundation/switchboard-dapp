import { Action, createReducer, on } from '@ngrx/store';
import * as RevokableActions from './revokable.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

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
  )
);

export function reducer(state: RevokableState | undefined, action: Action) {
  return revokableReducer(state, action);
}
