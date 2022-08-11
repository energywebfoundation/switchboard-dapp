import { Claim, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaim } from 'src/app/routes/enrolment/models/enrolment-claim';
import * as OwnedSelectors from './owned.selectors';

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

    it('should return 1 when one element is accepted is pending sync (on-chain claim)', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          new EnrolmentClaim({
            isAccepted: true,
            registrationTypes: [RegistrationTypes.OnChain],
            expirationTimestamp: (Date.now() + 500000).toString(),
          } as Claim),
        ])
      ).toEqual(1);
    });
    it('should return 1 when one element is accepted is pending sync (off-chain claim)', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          new EnrolmentClaim({
            isAccepted: true,
            registrationTypes: [RegistrationTypes.OffChain],
            expirationTimestamp: (Date.now() + 500000).toString(),
          } as Claim).setIsSyncedOffChain(false),
        ])
      ).toEqual(1);
    });
  });
});
