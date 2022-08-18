import { createSelector } from '@ngrx/store';

import { USER_FEATURE_KEY } from './requested.reducer';
import { getEnrolmentsState } from '../enrolments.reducer';
import { isExperimentalEnabled } from '../../settings/settings.selectors';
import { removeAssetsFromList } from '../utils/remove-assets-from-list/remove-assets-from-list';

export const getRequestedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllEnrolments = createSelector(
  getRequestedState,
  (state) => state.enrolments
);

export const getEnrolments = createSelector(
  isExperimentalEnabled,
  getAllEnrolments,
  (isExperimental, allEnrolments) => {
    if (!isExperimental) {
      return removeAssetsFromList(allEnrolments);
    }

    return allEnrolments;
  }
);

export const getPendingEnrolmentsAmount = createSelector(
  getAllEnrolments,
  (enrolments) => {
    return enrolments.filter((enrolment) => enrolment.isPending).length;
  }
);
