import { TestBed } from '@angular/core/testing';

import { IamRequestService } from './iam-request.service';

describe('IamRequestService', () => {
  let service: IamRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IamRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
