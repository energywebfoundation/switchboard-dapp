import * as owned from './owned/owned.reducer';
import * as enrolmentRequests from './requested/requested.reducer';
import * as revokable from './revokable/revokable.reducer';
import { createFeatureSelector } from '@ngrx/store';

export const USER_FEATURE_KEY = 'enrolments';

export interface EnrolmentsState {
  [enrolmentRequests.USER_FEATURE_KEY]: enrolmentRequests.RequestedState;
  [owned.USER_FEATURE_KEY]: owned.OwnedState;
  [revokable.USER_FEATURE_KEY]: revokable.RevokableState;
}

export const getEnrolmentsState =
  createFeatureSelector<EnrolmentsState>(USER_FEATURE_KEY);

export const reducer = {
  [enrolmentRequests.USER_FEATURE_KEY]: enrolmentRequests.reducer,
  [owned.USER_FEATURE_KEY]: owned.reducer,
  [revokable.USER_FEATURE_KEY]: revokable.reducer,
};
