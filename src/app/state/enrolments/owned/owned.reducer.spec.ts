import * as fromReducer from './owned.reducer';
import * as OwnedActions from './owned.actions';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

describe('Owned Enrolments reducer', () => {
  describe('getOwnedEnrolmentsSuccess action', () => {
    it('should set enrolments in an immutable way', () => {
      const { initialState } = fromReducer;
      const enrolments = [{} as EnrolmentClaim];
      const action = OwnedActions.getOwnedEnrolmentsSuccess({ enrolments });
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
      const action = OwnedActions.updateEnrolmentSuccess({
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

  describe('removeEnrolment action', () => {
    it('should remove element from the list', () => {
      const { initialState } = fromReducer;
      const enrolments = [
        { isAccepted: false, id: '1' },
        { isAccepted: true, id: '3' },
      ] as EnrolmentClaim[];
      const action = OwnedActions.removeEnrolment({ id: '1' });
      const state = fromReducer.reducer(
        { ...initialState, enrolments },
        action
      );

      expect(
        state.enrolments.find((enrolment) => enrolment.id === '1')
      ).toBeFalsy();
      expect(
        state.enrolments.find((enrolment) => enrolment.id === '3')
      ).toBeTruthy();
      expect(state.enrolments.length).toEqual(1);
    });
  });
});
