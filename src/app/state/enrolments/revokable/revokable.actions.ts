import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { createAction, props } from '@ngrx/store';
export const getRevokableEnrolments = createAction(
  '[REVOKABLE ENROLMENTS] Get Revolable Enrolments'
);

export const getRevokableEnrolmentsSuccess = createAction(
  '[REVOKABLE ENROLMENTS] Get Revokable Enrolments Success',
  props<{ enrolments: any[] }>()
);

export const getRevokableEnrolmentsFailure = createAction(
  '[REVOKABLE ENROLMENTS] Get Revolable Enrolments Failure',
  props<{ error: string }>()
);

export const updateRevokableEnrolments = createAction(
  '[REVOKABLE ENROLMENTS] Update Revokable Enrolments'
);

export const updateRevokableEnrolmentsSuccess = createAction(
  '[REVOKABLE ENROLMENTS] Update Revokable Enrolments Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const updateRevokableEnrolmentsFailure = createAction(
  '[Revokable ENROLMENTS] Update Revokable Enrolments Failure',
  props<{ error: string }>()
);
