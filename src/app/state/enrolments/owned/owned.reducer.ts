import { Action, createReducer, on } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';

export const USER_FEATURE_KEY = 'owned';

export interface OwnedState {
  enrolments: EnrolmentClaim[];
  filteredList: EnrolmentClaim[];
  error: string;
}

export const initialState: OwnedState = {
  enrolments: [],
  filteredList: [],
  error: null,
};

const ownedReducer = createReducer(
  initialState,
  on(
    OwnedActions.getOwnedEnrolmentsSuccess,
    OwnedActions.updateOwnedEnrolmentsSuccess,
    (state, { enrolments }) => ({
      ...state,
      enrolments,
    })
  )
);

export function reducer(state: OwnedState | undefined, action: Action) {
  return ownedReducer(state, action);
}
