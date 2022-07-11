import { TestBed } from '@angular/core/testing';

import { EnrolmentDetailsRequestsService } from './enrolment-details-requests.service';

describe('EnrolmentDetailsRequestsService', () => {
  let service: EnrolmentDetailsRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolmentDetailsRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
