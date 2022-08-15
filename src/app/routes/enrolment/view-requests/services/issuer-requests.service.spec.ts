import { TestBed } from '@angular/core/testing';

import { IssuerRequestsService } from './issuer-requests.service';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';
import { of, throwError } from 'rxjs';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';
import { RegistrationTypes } from 'iam-client-lib';

describe('IssuerRequestsService', () => {
  let service: IssuerRequestsService;
  let dialog;
  let claimsFacadeSpy;
  let toastrSpy;
  beforeEach(() => {
    dialog = jasmine.createSpyObj(DialogService, ['confirm']);
    claimsFacadeSpy = jasmine.createSpyObj(ClaimsFacadeService, [
      'issueClaimRequest',
      'rejectClaimRequest',
    ]);
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: dialog },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
      ],
    });
    service = TestBed.inject(IssuerRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('approve tests', () => {
    it('should successfully approve claim request', (done) => {
      const claim = {
        requester: 'requester',
        id: 'id',
        token: 'toke',
        subjectAgreement: 'subject agreement',
        registrationTypes: [
          RegistrationTypes.OnChain,
          RegistrationTypes.OffChain,
        ],
      };
      claimsFacadeSpy.issueClaimRequest.and.returnValue(of(null));

      service.approve(claim as EnrolmentClaim, [], undefined).subscribe(() => {
        expect(claimsFacadeSpy.issueClaimRequest).toHaveBeenCalledWith(
          jasmine.objectContaining(claim)
        );
        expect(claimsFacadeSpy.issueClaimRequest).toHaveBeenCalledWith(
          jasmine.objectContaining({
            issuerFields: [],
            publishOnChain: false,
            expirationTimestamp: undefined,
          })
        );
        expect(toastrSpy.success).toHaveBeenCalled();
        done();
      });
    });

    it('should display message when error occurs', (done) => {
      dialog.confirm.and.returnValue(of(true));
      claimsFacadeSpy.issueClaimRequest.and.returnValue(
        throwError({ message: 'error' })
      );
      service.approve({} as EnrolmentClaim, [], 0).subscribe(() => {
        expect(toastrSpy.error).toHaveBeenCalled();
        done();
      });
    });

    it('should use only valid issuer fields when approving', (done) => {
      const claim = {
        requester: 'requester',
        id: 'id',
        token: 'toke',
        subjectAgreement: 'subject agreement',
        registrationTypes: [
          RegistrationTypes.OnChain,
          RegistrationTypes.OffChain,
        ],
      };
      claimsFacadeSpy.issueClaimRequest.and.returnValue(of(null));

      service
        .approve(
          claim as EnrolmentClaim,
          [
            { key: 'label', value: undefined },
            { key: 'second label', value: '123' },
            { key: 'boolean value', value: false as any },
          ],
          undefined
        )
        .subscribe(() => {
          expect(claimsFacadeSpy.issueClaimRequest).toHaveBeenCalledWith(
            jasmine.objectContaining(claim)
          );
          expect(claimsFacadeSpy.issueClaimRequest).toHaveBeenCalledWith(
            jasmine.objectContaining({
              issuerFields: [
                { key: 'second label', value: '123' },
                { key: 'boolean value', value: false },
              ],
              publishOnChain: false,
              expirationTimestamp: undefined,
            })
          );
          expect(toastrSpy.success).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('reject tests', () => {
    it('should open confirm dialog', (done) => {
      dialog.confirm.and.returnValue(of());
      service.reject({} as EnrolmentClaim).subscribe();
      expect(dialog.confirm).toHaveBeenCalled();
      done();
    });

    it('should call reject claim when user confirms', (done) => {
      dialog.confirm.and.returnValue(of(true));
      claimsFacadeSpy.rejectClaimRequest.and.returnValue(of(true));
      service
        .reject({ id: 'id', requester: 'requester' } as EnrolmentClaim)
        .subscribe(() => {
          expect(claimsFacadeSpy.rejectClaimRequest).toHaveBeenCalledWith({
            id: 'id',
            requesterDID: 'requester',
          });
          expect(toastrSpy.success).toHaveBeenCalled();
          done();
        });
    });

    it('should display message when error occurs', (done) => {
      dialog.confirm.and.returnValue(of(true));
      claimsFacadeSpy.rejectClaimRequest.and.returnValue(
        throwError({ message: 'error' })
      );
      service
        .reject({ id: 'id', requester: 'requester' } as EnrolmentClaim)
        .subscribe(() => {
          expect(toastrSpy.error).toHaveBeenCalled();
          done();
        });
    });
  });
});
