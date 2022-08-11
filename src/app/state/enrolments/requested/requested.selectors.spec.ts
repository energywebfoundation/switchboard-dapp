import { Claim } from 'iam-client-lib';
import { EnrolmentClaim } from 'src/app/routes/enrolment/models/enrolment-claim';
import * as RequestedSelectors from './requested.selectors';
import { getEnrolments } from './requested.selectors';

describe('Requested Enrolments Selectors', () => {
  describe('getEnrolments', () => {
    const asset: any = {
      subject: 'subject',
      claimType: 'claimType',
      requester: 'requester',
    };
    it('should remove assets when experimental is disabled', () => {
      expect(
        RequestedSelectors.getEnrolments.projector(false, [asset])
      ).toEqual([]);
    });

    it('should return entire list when experimental is enabled', () => {
      expect(RequestedSelectors.getEnrolments.projector(true, [asset])).toEqual(
        [asset]
      );
    });
  });

  describe('getPendingEnrolmentsAmount', () => {
    it('should return 0 when all enrolments are accepted', () => {
      expect(
        RequestedSelectors.getPendingEnrolmentsAmount.projector([
          { isAccepted: true, isRejected: false },
        ])
      ).toEqual(0);
    });

    it('should return 0 when all enrolments are rejected', () => {
      expect(
        RequestedSelectors.getPendingEnrolmentsAmount.projector([
          { isAccepted: false, isRejected: true },
        ])
      ).toEqual(0);
    });

    it('should return 1 when enrolment is not rejected nor accepted', () => {
      expect(
        RequestedSelectors.getPendingEnrolmentsAmount.projector([
          new EnrolmentClaim({
            isAccepted: false,
            isRejected: false
          } as Claim),
        ])
      ).toEqual(1);
    });
  });
});
