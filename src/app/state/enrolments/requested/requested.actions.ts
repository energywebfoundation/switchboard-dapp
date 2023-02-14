import { createAction, props } from '@ngrx/store';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const getEnrolmentRequests = createAction(
  '[ENROLMENT REQUESTS] Get Enrolment Requests'
);

export const getEnrolmentRequestsSuccess = createAction(
  '[ENROLMENT REQUESTS] Get Enrolment Requests Success',
  props<{ enrolments: EnrolmentClaim[] }>()
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
  props<{ enrolment: EnrolmentClaim }>()
)

export const updateEnrolmentSuccess = createAction(
  '[Enrolment Requests] Update Enrolment Success',
  props<{ enrolment: EnrolmentClaim }>()
)

export const updateEnrolmentFailure = createAction(
  '[Enrolment Requests] Update Enrolment Failure',
  props<{ error: string }>()
)

export const updateEnrolmentRequestsSuccess = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const updateEnrolmentRequestsFailure = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Failure',
  props<{ error: string }>()
);
