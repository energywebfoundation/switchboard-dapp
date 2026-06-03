import { Action, createReducer, on } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const USER_FEATURE_KEY = 'owned';

export interface OwnedState {
  enrolments: EnrolmentClaim[];
  skip: number;
  take: number;
  hasNextPage: boolean;
}

export const initialState: OwnedState = {
  enrolments: [],
  skip: 0,
  take: OwnedActions.PAGE_SIZE,
  hasNextPage: false,
};

const ownedReducer = createReducer(
  initialState,
  on(
    OwnedActions.getOwnedEnrolmentsSuccess,
    (state, { enrolments, skip, take }) => ({
      ...state,
      enrolments,
      skip,
      take,
      hasNextPage: enrolments.length === take,
    })
  ),
  on(OwnedActions.updateOwnedEnrolmentsSuccess, (state, { enrolments }) => ({
    ...state,
    enrolments,
    hasNextPage: enrolments.length === state.take,
  })),
  on(OwnedActions.updateEnrolmentSuccess, (state, { enrolment }) => ({
    ...state,
    enrolments: [
      ...state.enrolments.filter((e) => e.id !== enrolment.id),
      enrolment,
    ].filter(Boolean),
  })),
  on(OwnedActions.removeEnrolment, (state, { id }) => ({
    ...state,
    enrolments: state.enrolments.filter((e) => e.id !== id),
  }))
);

export function reducer(state: OwnedState | undefined, action: Action) {
  return ownedReducer(state, action);
}
