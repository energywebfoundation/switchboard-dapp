import { Action, createReducer, on } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const USER_FEATURE_KEY = 'requested';

export interface RequestedState {
  enrolments: EnrolmentClaim[];
  skip: number;
  take: number;
  hasNextPage: boolean;
}

export const initialState: RequestedState = {
  enrolments: [],
  skip: 0,
  take: RequestedActions.PAGE_SIZE,
  hasNextPage: false,
};

const requestedReducer = createReducer(
  initialState,
  on(
    RequestedActions.getEnrolmentRequestsSuccess,
    (state, { enrolments, skip, take, hasNextPage }) => ({
      ...state,
      enrolments,
      skip,
      take,
      hasNextPage,
    })
  ),
  on(RequestedActions.updateEnrolmentRequestsSuccess, (state, { enrolments, hasNextPage }) => ({
    ...state,
    enrolments,
    hasNextPage,
  })),
  on(RequestedActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    ...state,
    enrolments: [
      ...state.enrolments.filter((e) => e.id !== enrolment.id),
      enrolment,
    ].filter(Boolean),
  })),
  on(RequestedActions.removeEnrolment, (state, { id }) => ({
    ...state,
    enrolments: state.enrolments.filter((e) => e.id !== id),
  }))
);

export function reducer(state: RequestedState | undefined, action: Action) {
  return requestedReducer(state, action);
}
