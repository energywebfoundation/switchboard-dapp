import * as fromReducer from './requested.reducer';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import * as RequestedActions from './requested.actions';

describe('Requested enrolments reducer', () => {
  describe('getEnrolmentRequestsSuccess action', () => {
    it('should set enrolments in an immutable way', () => {
      const { initialState } = fromReducer;
      const enrolments = [{} as EnrolmentClaim];
      const action = RequestedActions.getEnrolmentRequestsSuccess({ enrolments
      });
      const state = fromReducer.reducer(initialState, action);

      expect(state.enrolments).toEqual(enrolments);
    });
  });

  describe('updateEnrolmentSuccess action', () => {
    it('should update enrolment', () => {
      const { initialState } = fromReducer;
      const enrolments = [{isAccepted: false, id: '1'}, {isAccepted: true, id: '3'}]  as EnrolmentClaim[];
      const action = RequestedActions.updateEnrolmentSuccess({enrolment: {isAccepted: true, id: '1'} as EnrolmentClaim});
      const state = fromReducer.reducer({...initialState, enrolments}, action);

      expect(state.enrolments.find(enrolment => enrolment.id === '1').isAccepted).toEqual(true);
      expect(state.enrolments.find(enrolment => enrolment.id === '3')).toBeTruthy();
      expect(state.enrolments.length).toEqual(2);
    });
  });
});
