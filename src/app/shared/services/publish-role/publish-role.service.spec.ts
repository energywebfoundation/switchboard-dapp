import { TestBed } from '@angular/core/testing';

import { PublishRoleService } from './publish-role.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { dialogSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';
import { from, of } from 'rxjs';
import { RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { provideMockStore } from '@ngrx/store/testing';

describe('PublishRoleService', () => {
  let service: PublishRoleService;
  let toastrSpy;
  let claimsFacadeSpy;
  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
      'warning',
    ]);

    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'publishPublicClaim',
      'registerOnchain',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockStore(),
      ],
    });
    service = TestBed.inject(PublishRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToDidDoc', () => {
    beforeEach(() => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
    });

    it('should return true', (done) => {
      claimsFacadeSpy.publishPublicClaim.and.returnValue(of(true));
      service
        .addToDidDoc({
          issuedToken: 'some-token',
          registrationTypes: [],
          claimType: '',
          claimTypeVersion: '1',
          isSyncedOnChain: false,
        } as EnrolmentClaim)
        .subscribe((v) => {
          expect(toastrSpy.success).toHaveBeenCalled();
          expect(v).toBeTrue();
          done();
        });
    });

    it('should return false', (done) => {
      claimsFacadeSpy.publishPublicClaim.and.returnValue(of(undefined));
      service
        .addToDidDoc({
          issuedToken: 'some-token',
          registrationTypes: [],
          claimType: '',
          claimTypeVersion: '1',
          isSyncedOnChain: false,
        } as EnrolmentClaim)
        .subscribe((v) => {
          expect(toastrSpy.warning).toHaveBeenCalled();
          expect(v).toBeFalse();
          done();
        });
    });
    it('should publish only with OffChain when onChain is synced', (done) => {
      claimsFacadeSpy.publishPublicClaim.and.returnValue(of(true));
      const enrolment = {
        issuedToken: 'some-token',
        registrationTypes: [
          RegistrationTypes.OnChain,
          RegistrationTypes.OffChain,
        ],
        claimType: '',
        claimTypeVersion: '1',
        isSyncedOnChain: true,
      } as EnrolmentClaim;
      service.addToDidDoc(enrolment).subscribe(() => {
        expect(claimsFacadeSpy.publishPublicClaim).toHaveBeenCalledOnceWith({
          registrationTypes: [RegistrationTypes.OffChain],
          claim: {
            token: enrolment.issuedToken,
            claimType: enrolment.claimType,
          },
        });
        done();
      });
    });
    it('should publish with OnChain and OffChain when onChain is not synced', (done) => {
      claimsFacadeSpy.publishPublicClaim.and.returnValue(of(true));
      const enrolment = {
        issuedToken: 'some-token',
        registrationTypes: [
          RegistrationTypes.OnChain,
          RegistrationTypes.OffChain,
        ],
        claimType: '',
        claimTypeVersion: '1',
        isSyncedOnChain: false,
      } as EnrolmentClaim;
      service.addToDidDoc(enrolment).subscribe(() => {
        expect(claimsFacadeSpy.publishPublicClaim).toHaveBeenCalledOnceWith({
          registrationTypes: [
            RegistrationTypes.OnChain,
            RegistrationTypes.OffChain,
          ],
          claim: {
            token: enrolment.issuedToken,
            claimType: enrolment.claimType,
          },
        });
        done();
      });
    });
  });

  describe('addToClaimManager', () => {
    beforeEach(() => {
      dialogSpy.open.and.returnValue({ afterClosed: () => of(true) });
    });

    it('should return true when registerOnchain do not throw error', (done) => {
      claimsFacadeSpy.registerOnchain.and.returnValue(from(Promise.resolve()));
      service.addToClaimManager({} as any).subscribe((v) => {
        expect(toastrSpy.success).toHaveBeenCalled();
        expect(v).toBeTrue();
        done();
      });
    });
  });
});
