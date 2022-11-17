import { createSelector } from '@ngrx/store';

import { USER_FEATURE_KEY } from './requested.reducer';
import { getEnrolmentsState } from '../enrolments.reducer';

export const getRequestedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllEnrolments = createSelector(
  getRequestedState,
  (state) => state.enrolments
);

export const getPendingEnrolmentsAmount = createSelector(
  getAllEnrolments,
  (enrolments) => {
    return enrolments.filter((enrolment) => enrolment.isPending).length;
  }
);
