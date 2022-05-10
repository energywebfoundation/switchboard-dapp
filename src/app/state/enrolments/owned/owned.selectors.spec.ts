import * as OwnedSelectors from './owned.selectors';
import { getNotSyncedAmount } from './owned.selectors';

describe('Owned Enrolments Selectors', () => {
  describe('getNotSyncedAmount', () => {
    it('should return 0 when all elements are not accepted', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          {
            isAccepted: false,
          },
        ])
      ).toEqual(0);
    });

    it('should return 0 when all elements are accepted and synced', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          {
            isAccepted: true,
            isSynced: true,
          },
        ])
      ).toEqual(0);
    });

    it('should return 1 when one element is accepted but not synced', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          {
            isAccepted: true,
            isSynced: false,
          },
        ])
      ).toEqual(1);
    });
  });
});
