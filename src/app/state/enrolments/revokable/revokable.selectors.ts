import { createSelector } from '@ngrx/store';
import { getEnrolmentsState } from '../enrolments.reducer';
import { USER_FEATURE_KEY } from './revokable.reducer';

export const getRevokableState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllRevokableEnrolments = createSelector(
  getRevokableState,
  (state) => state.enrolments
);

export const getEnrolments = createSelector(
  getAllRevokableEnrolments,
  (allEnrolments) => {
    return allEnrolments;
  }
);
