import { TestBed } from '@angular/core/testing';

import { ClaimsFacadeService } from './claims-facade.service';

describe('ClaimsFacadeService', () => {
  let service: ClaimsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
