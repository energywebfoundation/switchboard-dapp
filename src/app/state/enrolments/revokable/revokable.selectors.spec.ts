import * as RevokableSelectors from './revokable.selectors';

describe('Requested Enrolments Selectors', () => {
  describe('getAllEnrolments', () => {
    it('should return default state', () => {
      expect(
        RevokableSelectors.getAllEnrolments.projector({
          enrolments: [],
          skip: 0,
          take: 5,
          hasNextPage: false,
        })
      ).toEqual([]);
    });
  });

  describe('getPagination', () => {
    it('should return pagination state', () => {
      expect(
        RevokableSelectors.getPagination.projector({
          enrolments: [],
          skip: 5,
          take: 5,
          hasNextPage: true,
        })
      ).toEqual({
        skip: 5,
        take: 5,
        hasNextPage: true,
      });
    });
  });
});
