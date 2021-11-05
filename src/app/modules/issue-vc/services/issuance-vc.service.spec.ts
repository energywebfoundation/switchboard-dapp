import { TestBed } from '@angular/core/testing';

import { IssuanceVcService } from './issuance-vc.service';
import { IamService } from '../../../shared/services/iam.service';
import { iamServiceSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../../../shared/services/loading.service';
import { of } from 'rxjs';

describe('IssuanceVcService', () => {
  let service: IssuanceVcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: iamServiceSpy},
        {provide: LoadingService, useValue: loadingServiceSpy}
      ]
    });
    iamServiceSpy.getAllowedRolesByIssuer.and.returnValue(of([]));
    service = TestBed.inject(IssuanceVcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
