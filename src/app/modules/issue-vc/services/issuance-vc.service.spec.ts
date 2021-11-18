import { TestBed } from '@angular/core/testing';

import { IssuanceVcService } from './issuance-vc.service';
import { IamService } from '../../../shared/services/iam.service';
import { iamServiceSpy } from '@tests';

describe('IssuanceVcService', () => {
  let service: IssuanceVcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: iamServiceSpy}
      ]
    });
    service = TestBed.inject(IssuanceVcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
