import { FilterBuilder } from './filter.builder';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { FilterStatus } from '../models/filter-status.enum';
import { Claim } from 'iam-client-lib';

describe('FilterBuilder', () => {
  describe('DID filter', () => {
    it('should return the same list when filter value is falsy', () => {
      expect(new FilterBuilder([{} as any]).did('').build()).toEqual([
        {} as any,
      ]);
    });

    it('should remove element from list depending on subject property', () => {
      expect(
        new FilterBuilder([
          { subject: 'test', requester: '' },
          { subject: 'cool', requester: '' },
        ] as any[])
          .did('te')
          .build()
      ).toEqual([{ subject: 'test', requester: '' }] as any);
    });

    it('should remove element from list depending on requester property', () => {
      expect(
        new FilterBuilder([
          { subject: 'test', requester: 'test2' },
          { subject: 'cool', requester: '' },
        ] as any[])
          .did('st2')
          .build()
      ).toEqual([{ subject: 'test', requester: 'test2' }] as any);
    });
  });

  describe('namespace filter', () => {
    it('should return the same list when filter value is falsy', () => {
      expect(new FilterBuilder([{} as any]).namespace('').build()).toEqual([
        {} as any,
      ]);
    });

    it('should remove 1 element from list', () => {
      expect(
        new FilterBuilder([
          { namespace: 'test' },
          { namespace: 'cool' },
        ] as any[])
          .namespace('te')
          .build()
      ).toEqual([{ namespace: 'test' }] as any);
    });

    it('should not be case sensitive', () => {
      expect(
        new FilterBuilder([{ namespace: 'test' }] as any[])
          .namespace('TE')
          .build()
      ).toEqual([{ namespace: 'test' }] as any);
    });
  });
  describe('Status filter', () => {
    const list = [
      new EnrolmentClaim({ isAccepted: false, isRejected: false } as Claim),
      new EnrolmentClaim({ isAccepted: false, isRejected: true } as Claim),
      new EnrolmentClaim({ isAccepted: true, isRejected: false } as Claim),
      new EnrolmentClaim({
        isAccepted: true,
        isRejected: false,
      } as Claim).setIsRevoked(true),
    ] as unknown as EnrolmentClaim[];

    it('should return all elements', () => {
      expect(
        new FilterBuilder(list).status(FilterStatus.All).build().length
      ).toEqual(4);
    });

    it('should return only rejected elements', () => {
      expect(
        new FilterBuilder(list).status(FilterStatus.Rejected).build().length
      ).toEqual(1);
    });

    it('should return only approved elements', () => {
      expect(
        new FilterBuilder(list).status(FilterStatus.Approved).build().length
      ).toEqual(1);
    });

    it('should return pending elements', () => {
      expect(
        new FilterBuilder(list).status(FilterStatus.Pending).build().length
      ).toEqual(1);
    });

    it('should return only revoked elements', () => {
      expect(
        new FilterBuilder(list).status(FilterStatus.Revoked).build().length
      ).toEqual(1);
    });
  });
});
