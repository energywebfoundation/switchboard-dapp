import { TestBed } from '@angular/core/testing';

import { EnrolmentFilterListService } from './enrolment-filter-list.service';
import { FilterStatus } from '../models/filter-status.enum';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { Claim } from 'iam-client-lib';

const acceptedClaim = new EnrolmentClaim({
  isAccepted: true,
  isRejected: false,
  namespace: 'claim.namespace.iam.ewc',
  subject: 'subject',
  requester: '',
} as Claim).setIsRevokedOnChain(false);

const notAcceptedClaim = new EnrolmentClaim({
  isAccepted: false,
  isRejected: false,
  namespace: 'another.namespace.iam.ewc',
  subject: '',
  requester: '',
} as Claim).setIsRevokedOnChain(false);
const claims = [acceptedClaim, notAcceptedClaim] as any[];

describe('EnrolmentFilterListService', () => {
  let service: EnrolmentFilterListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnrolmentFilterListService],
    });
    service = TestBed.inject(EnrolmentFilterListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter by did', (done) => {
    service.setList([...claims]);

    service.setDid('subject');
    service.filteredList$.subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list).toEqual([acceptedClaim] as any[]);
      done();
    });
  });
  it('should filter by status', (done) => {
    service.setList([...claims]);

    service.setStatus(FilterStatus.Approved);
    service.filteredList$.subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list).toEqual([acceptedClaim] as any[]);
      done();
    });
  });

  it('should filter by namespace', (done) => {
    service.setList([...claims]);

    service.setNamespace('claim');
    service.filteredList$.subscribe((list) => {
      expect(list.length).toEqual(1);
      expect(list).toEqual([acceptedClaim] as any[]);
      done();
    });
  });
});
