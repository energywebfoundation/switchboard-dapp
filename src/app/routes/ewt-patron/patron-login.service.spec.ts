import { TestBed } from '@angular/core/testing';

import { PatronLoginService } from './patron-login.service';

xdescribe('PatronLoginService', () => {
  let service: PatronLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatronLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
