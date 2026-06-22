import { Claim, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaim } from 'src/app/routes/enrolment/models/enrolment-claim';
import { PAGE_SIZE } from './owned.actions';
import * as OwnedSelectors from './owned.selectors';

describe('Owned Enrolments Selectors', () => {
  describe('getNotSyncedAmount', () => {
    it('should return 0 when all elements are not accepted', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          {
            isAccepted: false,
          },
        ] as EnrolmentClaim[])
      ).toEqual(0);
    });

    it('should return 0 when all elements are accepted and synced', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          {
            isAccepted: true,
            isSynced: true,
          },
        ] as EnrolmentClaim[])
      ).toEqual(0);
    });

    it('should return 1 when one element is accepted is pending sync (on-chain claim)', () => {
      expect(
        OwnedSelectors.getNotSyncedAmount.projector([
          new EnrolmentClaim({
            isAccepted: true,
            registrationTypes: [RegistrationTypes.OnChain],
            expirationTimestamp: (Date.now() + 500000).toString(),
          } as unknown as Claim).setIsSyncedOnChain(false),
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
          } as unknown as Claim).setIsSyncedOffChain(false),
        ])
      ).toEqual(1);
    });
  });

  describe('getAllEnrolments', () => {
    it('should return default state', () => {
      expect(
        OwnedSelectors.getAllEnrolments.projector({
          enrolments: [],
          skip: 0,
          take: PAGE_SIZE,
          hasNextPage: false,
        })
      ).toEqual([]);
    });
  });

  describe('getPagination', () => {
    it('should return pagination state', () => {
      expect(
        OwnedSelectors.getPagination.projector({
          enrolments: [],
          skip: 5,
          take: PAGE_SIZE,
          hasNextPage: true,
        })
      ).toEqual({
        skip: 5,
        take: PAGE_SIZE,
        hasNextPage: true,
      });
    });
  });
});
