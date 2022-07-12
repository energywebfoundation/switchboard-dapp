import { TestBed } from '@angular/core/testing';

import { IssuerRequestsService } from './enrolment-details-requests.service';

describe('EnrolmentDetailsRequestsService', () => {
  let service: IssuerRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuerRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
