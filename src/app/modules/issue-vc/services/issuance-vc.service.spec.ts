import { TestBed } from '@angular/core/testing';

import { IssuanceVcService } from './issuance-vc.service';

describe('IssuanceVcService', () => {
  let service: IssuanceVcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssuanceVcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
