import { TestBed } from '@angular/core/testing';

import { VerificationService } from './verification.service';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToasterService } from '../../../shared/services/switchboard-toaster.service';

describe('VerificationService', () => {
  let service: VerificationService;
  const iamServiceSpy = jasmine.createSpyObj('IamService', ['iam']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: iamServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToasterService, useValue: toastrSpy }
      ]
    });
    service = TestBed.inject(VerificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
