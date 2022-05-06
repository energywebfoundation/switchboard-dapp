import { createSelector } from '@ngrx/store';

import { RequestedState, USER_FEATURE_KEY } from './requested.reducer';
import { getEnrolmentsState } from '../enrolments.reducer';
import { isExperimentalEnabled } from '../../settings/settings.selectors';
import { removeAssetsFromList } from '../utils/remove-assets-from-list/remove-assets-from-list';
import { getOwnedState } from '../owned/owned.selectors';
import { RegistrationTypes } from 'iam-client-lib';

export const getRequestedState = createSelector(
  getEnrolmentsState,
  (state) => state && state[USER_FEATURE_KEY]
);

export const getAllEnrolments = createSelector(
  getRequestedState,
  (state) => state.enrolments
);

export const getFilteredEnrolments = createSelector(
  getRequestedState,
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

export const getNotSyncedAmount = createSelector(
  getAllEnrolments,
  (enrolments) => {
    return enrolments.filter(enrolment => enrolment.isAccepted).filter(element => {
      return (
        !element?.isSynced &&
        element.registrationTypes.includes(RegistrationTypes.OffChain) &&
        !(
          element.registrationTypes.length === 1 &&
          element.registrationTypes.includes(RegistrationTypes.OnChain)
        )
      );
    }).length;
  }
)
