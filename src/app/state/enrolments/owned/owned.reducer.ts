import { Action, createReducer, on } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const USER_FEATURE_KEY = 'owned';

export interface OwnedState {
  enrolments: EnrolmentClaim[];
}

export const initialState: OwnedState = {
  enrolments: [],
};

const ownedReducer = createReducer(
  initialState,
  on(
    OwnedActions.getOwnedEnrolmentsSuccess,
    OwnedActions.updateOwnedEnrolmentsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
    })
  ),
  on(OwnedActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    enrolments: [
      ...state.enrolments.filter((e) => e.id !== enrolment.id),
      enrolment,
    ].filter(Boolean),
  })),
  on(OwnedActions.removeEnrolment, (state, { id }) => ({
    enrolments: state.enrolments.filter((e) => e.id !== id),
  }))
);

export function reducer(state: OwnedState | undefined, action: Action) {
  return ownedReducer(state, action);
}
