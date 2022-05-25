import { TestBed } from '@angular/core/testing';

import { EnrolmentFilterListService } from './enrolment-filter-list.service';

describe('EnrolmentFilterListService', () => {
  let service: EnrolmentFilterListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnrolmentFilterListService]
    });
    service = TestBed.inject(EnrolmentFilterListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
