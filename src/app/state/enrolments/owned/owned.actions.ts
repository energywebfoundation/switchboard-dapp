import { createAction, props } from '@ngrx/store';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

export const getOwnedEnrolments = createAction(
  '[OWNED ENROLMENTS] Get Owned Enrolments'
);

export const getOwnedEnrolmentsSuccess = createAction(
  '[OWNED ENROLMENTS] Get Owned Enrolments Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const getOwnedEnrolmentsFailure = createAction(
  '[OWNED ENROLMENTS] Get Owned Enrolments Failure',
  props<{ error: string }>()
);

export const updateOwnedEnrolments = createAction(
  '[OWNED ENROLMENTS] Update Owned Enrolments'
);

export const updateOwnedEnrolmentsSuccess = createAction(
  '[OWNED ENROLMENTS] Update Owned Enrolments Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const updateOwnedEnrolmentsFailure = createAction(
  '[OWNED ENROLMENTS] Update Owned Enrolments Failure',
  props<{ error: string }>()
);

export const updateEnrolment = createAction(
  '[OWNED ENROLMENTS] Update Enrolment',
  props<{ enrolment: EnrolmentClaim }>()
);

export const removeEnrolment = createAction(
  '[OWNED ENROLMENTS] Remove Enrolment',
  props<{ enrolment: EnrolmentClaim }>()
);

export const updateEnrolmentSuccess = createAction(
  '[OWNED ENROLMENTS] Update Enrolment Success',
  props<{ enrolment: EnrolmentClaim }>()
);

export const updateEnrolmentFailure = createAction(
  '[OWNED ENROLMENTS] Update Enrolment Failure',
  props<{ error: string }>()
);
