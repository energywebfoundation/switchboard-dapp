import { TestBed } from '@angular/core/testing';

import { SignerFacadeService } from './signer-facade.service';

describe('SignerFacadeService', () => {
  let service: SignerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
