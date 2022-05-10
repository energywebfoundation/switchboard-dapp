import { createAction, props } from '@ngrx/store';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';

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

export const changeFilterStatus = createAction(
  '[OWNED ENROLMENTS] Change Filter Status',
  props<{ status: FilterStatus }>()
);

export const changeNamespaceFilter = createAction(
  '[OWNED ENROLMENTS] Change Namespace Filter',
  props<{ value: string }>()
);