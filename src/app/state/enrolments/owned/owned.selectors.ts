import { createSelector } from '@ngrx/store';
import { getEnrolmentsState } from '../enrolments.reducer';
import { USER_FEATURE_KEY } from './owned.reducer';

export const getOwnedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllEnrolments = createSelector(
  getOwnedState,
  (state) => state.enrolments
);

export const getNotSyncedAmount = createSelector(
  getAllEnrolments,
  (enrolments) => {
    return enrolments.filter((enrolment) => enrolment.canPublishClaim).length;
  }
);
