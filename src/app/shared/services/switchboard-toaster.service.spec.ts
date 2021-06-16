import { TestBed } from '@angular/core/testing';

import { SwitchboardToasterService } from './switchboard-toaster.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('SwitchboardToasterService', () => {
  let service: SwitchboardToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrService],
      imports: [ToastrModule.forRoot()]
    });
    service = TestBed.inject(SwitchboardToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
