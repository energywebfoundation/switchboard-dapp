import { statusFilter } from './status-filter';
import { FilterStatus } from '../../../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';
import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim.interface';

describe('statusFilter', () => {
  const list = [
    { isAccepted: false, isRejected: false },
    { isAccepted: false, isRejected: true },
    { isAccepted: true, isRejected: false },
  ] as EnrolmentClaim[];

  it('should return all elements', () => {
    expect(statusFilter(list, FilterStatus.All)).toEqual(list);
  });

  it('should return only rejected elements', () => {
    expect(statusFilter(list, FilterStatus.Rejected)).toEqual([{
      isAccepted: false,
      isRejected: true,
    }] as EnrolmentClaim[]);
  });

  it('should return only approved elements', () => {
    expect(statusFilter(list, FilterStatus.Approved)).toEqual([{
      isAccepted: true,
      isRejected: false,
    }] as EnrolmentClaim[]);
  });

  it('should return pending elements', () => {
    expect(statusFilter(list, FilterStatus.Pending)).toEqual([{
      isAccepted: false,
      isRejected: false,
    }] as EnrolmentClaim[]);
  })
});
