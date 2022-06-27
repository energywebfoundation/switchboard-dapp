import { TestBed } from '@angular/core/testing';

import { RevokeService } from './revoke.service';

describe('RevokeService', () => {
  let service: RevokeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevokeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
