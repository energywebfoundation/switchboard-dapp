import { TestBed } from '@angular/core/testing';

import { EnrolmentFilterListService } from './enrolment-filter-list.service';

describe('EnrolmentListService', () => {
  let service: EnrolmentFilterListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolmentFilterListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
