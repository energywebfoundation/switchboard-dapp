import { TestBed } from '@angular/core/testing';

import { DomainsFacadeService } from './domains-facade.service';

describe('DomainsFacadeService', () => {
  let service: DomainsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
