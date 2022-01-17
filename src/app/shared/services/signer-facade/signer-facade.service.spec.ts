import { TestBed } from '@angular/core/testing';

import { SignerFacadeService } from './signer-facade.service';
import { IamService } from '../iam.service';

describe('SignerFacadeService', () => {
  let service: SignerFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IamService, useValue: {} }],
    });
    service = TestBed.inject(SignerFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
