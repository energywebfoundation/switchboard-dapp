import * as fromReducer from './revokable.reducer';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import * as RevokableActions from './revokable.actions';

describe('Revokable enrolments reducer', () => {
  describe('getRevocableEnrolmentsSuccess action', () => {
    it('should set enrolments in an immutable way', () => {
      const { initialState } = fromReducer;
      const enrolments = [{} as EnrolmentClaim];
      const action = RevokableActions.getRevocableEnrolmentsSuccess({
        enrolments,
      });
      const state = fromReducer.reducer(initialState, action);

      expect(state.enrolments).toEqual(enrolments);
    });
  });

  describe('updateEnrolmentSuccess action', () => {
    it('should update enrolment', () => {
      const { initialState } = fromReducer;
      const enrolments = [
        { isAccepted: false, id: '1' },
        { isAccepted: true, id: '3' },
      ] as EnrolmentClaim[];
      const action = RevokableActions.updateEnrolmentSuccess({
        enrolment: { isAccepted: true, id: '1' } as EnrolmentClaim,
      });
      const state = fromReducer.reducer(
        { ...initialState, enrolments },
        action
      );

      expect(
        state.enrolments.find((enrolment) => enrolment.id === '1').isAccepted
      ).toEqual(true);
      expect(
        state.enrolments.find((enrolment) => enrolment.id === '3')
      ).toBeTruthy();
      expect(state.enrolments.length).toEqual(2);
    });
  });
});
