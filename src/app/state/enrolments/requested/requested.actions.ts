import { createAction, props } from '@ngrx/store';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { FilterStatus } from '../../../routes/enrolment/enrolment-list/enrolment-list-filter/enrolment-list-filter.component';

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

export const updateEnrolmentRequestsSuccess = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Success',
  props<{ enrolments: EnrolmentClaim[] }>()
);

export const updateEnrolmentRequestsFailure = createAction(
  '[ENROLMENT REQUESTS] Update Enrolment Requests Failure',
  props<{ error: string }>()
);

export const changeFilterStatus = createAction(
  '[ENROLMENT REQUESTS] Change Filter Status',
  props<{ status: FilterStatus }>()
);

export const changeNamespaceFilter = createAction(
  '[ENROLMENT REQUESTS] Change Namespace Filter',
  props<{ value: string }>()
);

export const changeDIDFilter = createAction(
  '[ENROLMENT REQUESTS] Change DID Filter',
  props<{ value: string }>()
);
