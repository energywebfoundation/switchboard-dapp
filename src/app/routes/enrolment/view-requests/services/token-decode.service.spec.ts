import { TestBed } from '@angular/core/testing';

import { TokenDecodeService } from './token-decode.service';

describe('TokenDecodeService', () => {
  let service: TokenDecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenDecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
