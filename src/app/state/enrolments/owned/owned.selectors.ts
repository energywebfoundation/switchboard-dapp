import { createSelector } from '@ngrx/store';
import { getEnrolmentsState } from '../enrolments.reducer';
import { USER_FEATURE_KEY } from './owned.reducer';
import { removeAssetsFromList } from '../utils/remove-assets-from-list/remove-assets-from-list';
import { isExperimentalEnabled } from '../../settings/settings.selectors';

export const getOwnedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllEnrolments = createSelector(
  getOwnedState,
  (state) => state.enrolments
);

export const getFilteredEnrolments = createSelector(
  getOwnedState,
  (state) => state.filteredList
)

export const getEnrolments = createSelector(
  isExperimentalEnabled,
  getFilteredEnrolments,
  (isExperimental, allEnrolments) => {
    if(!isExperimental) {
      return removeAssetsFromList(allEnrolments);
    }

    return allEnrolments
  }
)

