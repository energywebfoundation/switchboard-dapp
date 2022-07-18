import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { createAction, props } from '@ngrx/store';
export const getRevocableEnrolments = createAction(
  '[REVOCABLE ENROLMENTS] Get Enrolments'
);

export const getRevocableEnrolmentsSuccess = createAction(
  '[REVOCABLE ENROLMENTS] Get Enrolments Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const getRevocableEnrolmentsFailure = createAction(
  '[REVOCABLE ENROLMENTS] Get Revocable Enrolments Failure',
  props<{ error: string }>()
);

export const updateRevocableEnrolments = createAction(
  '[REVOCABLE ENROLMENTS] Update Revocable Enrolments'
);

export const updateRevocableEnrolmentsSuccess = createAction(
  '[REVOCABLE ENROLMENTS] Update Revocable Enrolments Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const updateRevocableEnrolmentsFailure = createAction(
  '[REVOCABLE ENROLMENTS] Update Revocable Enrolments Failure',
  props<{ error: string }>()
);
