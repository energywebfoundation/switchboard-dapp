import { createAction, props } from '@ngrx/store';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const PAGE_SIZE = 20;

export const getEnrolmentRequests = createAction(
  '[ENROLMENT REQUESTS] Get Enrolment Requests',
  props<{ skip: number; take: number }>()
);

export const getLastEnrolmentRequests = createAction(
  '[ENROLMENT REQUESTS] Get Last Enrolment Requests'
);

export const getEnrolmentRequestsSuccess = createAction(
  '[ENROLMENT REQUESTS] Get Enrolment Requests Success',
  props<{
    enrolments: EnrolmentClaim[];
    skip: number;
    take: number;
    hasNextPage: boolean;
  }>()
);

export const getEnrolmentRequestsFailure = createAction(
  '[ENROLMENT REQUESTS] Get Enrolment Requests Failure',
  props<{ error: string }>()
);

export const updateEnrolmentRequests = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests'
);

export const updateEnrolment = createAction(
  '[Enrolment Requests] Update Enrolment',
  props<{ id: string }>()
);

export const updateEnrolmentSuccess = createAction(
  '[Enrolment Requests] Update Enrolment Success',
  props<{ enrolment: EnrolmentClaim }>()
);

export const updateEnrolmentFailure = createAction(
  '[Enrolment Requests] Update Enrolment Failure',
  props<{ error: string }>()
);

export const updateEnrolmentRequestsSuccess = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Success',
  props<{ enrolments: EnrolmentClaim[]; hasNextPage: boolean }>()
);

export const updateEnrolmentRequestsFailure = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Failure',
  props<{ error: string }>()
);

export const removeEnrolment = createAction(
  '[Enrolment Requests] Remove Enrolment',
  props<{ id: string }>()
);
