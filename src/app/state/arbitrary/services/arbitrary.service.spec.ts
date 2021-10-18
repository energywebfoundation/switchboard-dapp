import { TestBed } from '@angular/core/testing';

import { ArbitraryService } from './arbitrary.service';

describe('ArbitraryService', () => {
  let service: ArbitraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArbitraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
