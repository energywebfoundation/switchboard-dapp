import { TestBed } from '@angular/core/testing';

import { PatronService } from './patron.service';

xdescribe('PatronService', () => {
  let service: PatronService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatronService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
