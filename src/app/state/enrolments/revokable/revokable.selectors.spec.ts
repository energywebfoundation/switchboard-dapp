import * as RevokableSelectors from './revokable.selectors';

describe('Requested Enrolments Selectors', () => {

  describe('getAllEnrolments', () => {
    it('should return default state', () => {
      expect(RevokableSelectors.getAllEnrolments.projector({enrolments: []})).toEqual([]);
    });
  });
});
