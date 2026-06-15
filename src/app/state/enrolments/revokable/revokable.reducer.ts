import { Action, createReducer, on } from '@ngrx/store';
import * as RevokableActions from './revokable.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const USER_FEATURE_KEY = 'revokable';

export interface RevokableState {
  enrolments: EnrolmentClaim[];
  skip: number;
  take: number;
  hasNextPage: boolean;
}

export const initialState: RevokableState = {
  enrolments: [],
  skip: 0,
  take: RevokableActions.PAGE_SIZE,
  hasNextPage: false,
};

const revokableReducer = createReducer(
  initialState,
  on(
    RevokableActions.getRevocableEnrolmentsSuccess,
    (state, { enrolments, skip, take }) => ({
      ...state,
      enrolments,
      skip,
      take,
      hasNextPage: enrolments.length === take,
    })
  ),
  on(RevokableActions.updateRevocableEnrolmentsSuccess, (state, { enrolments }) => ({
    ...state,
    enrolments,
    hasNextPage: enrolments.length === state.take,
  })),
  on(RevokableActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    ...state,
    enrolments: [
      ...state.enrolments.filter((e) => e.id !== enrolment.id),
      enrolment,
    ].filter(Boolean),
  }))
);

export function reducer(state: RevokableState | undefined, action: Action) {
  return revokableReducer(state, action);
}
