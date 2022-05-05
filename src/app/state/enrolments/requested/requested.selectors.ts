import { createSelector } from '@ngrx/store';

import { RequestedState, USER_FEATURE_KEY } from './requested.reducer';
import { getEnrolmentsState } from '../enrolments.reducer';

export const getRequestedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getEnrolments = createSelector(
  getRequestedState,
  (state) => state.enrolments
);
