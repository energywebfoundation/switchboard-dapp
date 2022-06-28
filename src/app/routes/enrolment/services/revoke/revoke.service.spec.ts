import { TestBed } from '@angular/core/testing';

import { RevokeService } from './revoke.service';
import { IamService } from '../../../../shared/services/iam.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { EnrolmentClaim } from '../../models/enrolment-claim';

describe('RevokeService', () => {
  let service: RevokeService;
  const claimsServiceSpy = jasmine.createSpyObj('IamService', ['revokeClaim']);

  let vcServiceSpy;
  let toastrSpy;
  let loadingServiceSpy;
  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
    ]);
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    vcServiceSpy = jasmine.createSpyObj('IamService', ['revokeCredential']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IamService,
          useValue: {
            claimsService: claimsServiceSpy,
            verifiableCredentialsService: vcServiceSpy,
          },
        },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
      ],
    });
    service = TestBed.inject(RevokeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //TODO: check why it's failing on GHA
  xit('should successfully revoke on chain claim', (done) => {
    const claim = { claimType: 'claimType', subject: 'subject' };
    claimsServiceSpy.revokeClaim.and.returnValue(Promise.resolve(true));

    service.revokeOnChain(claim as EnrolmentClaim).subscribe(() => {
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(toastrSpy.success).toHaveBeenCalled();
      expect(claimsServiceSpy.revokeClaim).toHaveBeenCalledOnceWith({
        claim: { namespace: claim.claimType, subject: claim.subject },
      });
      done();
    });
  });

  it('should decline revoke on chain claim', (done) => {
    claimsServiceSpy.revokeClaim.and.returnValue(Promise.resolve(false));

    service.revokeOnChain({} as EnrolmentClaim).subscribe(() => {
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(toastrSpy.error).toHaveBeenCalled();
      done();
    });
  });

  it('should catch an error when revoke will thrown', (done) => {
    claimsServiceSpy.revokeClaim.and.returnValue(
      Promise.reject({ message: 'reason' })
    );

    service.revokeOnChain({} as EnrolmentClaim).subscribe(() => {
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(toastrSpy.error).toHaveBeenCalledWith('reason');
      done();
    });
  });
});
