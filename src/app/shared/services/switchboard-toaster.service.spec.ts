import { TestBed } from '@angular/core/testing';

import { SwitchboardToasterService } from './switchboard-toaster.service';

describe('SwitchboardToasterService', () => {
  let service: SwitchboardToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchboardToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
