import { TestBed } from '@angular/core/testing';

import { ClaimsFacadeService } from './claims-facade.service';
import { IamService } from '../iam.service';
import { iamServiceSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';

describe('ClaimsFacadeService', () => {
  let service: ClaimsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: iamServiceSpy},
        {provide: LoadingService, useValue: loadingServiceSpy}
      ]
    });
    service = TestBed.inject(ClaimsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
