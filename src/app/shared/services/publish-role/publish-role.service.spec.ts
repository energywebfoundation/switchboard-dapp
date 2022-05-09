import { TestBed } from '@angular/core/testing';

import { PublishRoleService } from './publish-role.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';
import { from, of } from 'rxjs';
import { NamespaceType, RegistrationTypes } from 'iam-client-lib';

describe('PublishRoleService', () => {
  let service: PublishRoleService;
  let toastrSpy;
  let notifSpy;
  let claimsFacadeSpy;
  beforeEach(() => {
    toastrSpy = jasmine.createSpyObj('SwitchboardToastrService', [
      'success',
      'error',
      'warning',
    ]);

    notifSpy = jasmine.createSpyObj('NotificationService', [
      'decreasePendingDidDocSyncCount',
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'publishPublicClaim',
      'registerOnchain',
      'hasOnChainRole',
      'getUserClaims',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: NotificationService, useValue: notifSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
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
        })
        .subscribe((v) => {
          expect(toastrSpy.success).toHaveBeenCalled();
          expect(notifSpy.decreasePendingDidDocSyncCount).toHaveBeenCalled();
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
        })
        .subscribe((v) => {
          expect(toastrSpy.warning).toHaveBeenCalled();
          expect(v).toBeFalse();
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

  describe('checkForNotSyncedOnChain', () => {
    it('should set notSyncedOnChain property to true', async () => {
      claimsFacadeSpy.hasOnChainRole.and.returnValue(Promise.resolve(false));
      expect(
        await service.checkForNotSyncedOnChain({
          registrationTypes: [RegistrationTypes.OnChain],
          claimType: '',
          claimTypeVersion: '1',
        })
      ).toEqual(jasmine.objectContaining({ notSyncedOnChain: true }));
    });

    it('should set notSyncedOnChain property to false', async () => {
      claimsFacadeSpy.hasOnChainRole.and.returnValue(Promise.resolve(true));
      expect(
        await service.checkForNotSyncedOnChain({
          registrationTypes: [RegistrationTypes.OnChain],
          claimType: '',
          claimTypeVersion: '1',
        })
      ).toEqual(jasmine.objectContaining({ notSyncedOnChain: false }));
    });

    it('should not set notSyncedOnChain when it is not OnChain', async () => {
      claimsFacadeSpy.hasOnChainRole.and.returnValue(Promise.resolve(true));

      const item = {
        registrationTypes: [RegistrationTypes.OffChain],
        claimType: '',
        claimTypeVersion: '1',
      };
      expect(await service.checkForNotSyncedOnChain(item)).toEqual(item);
    });
  });

  describe('appendDidDocSyncStatus', () => {
    it('should return empty list when getting empty list', async () => {
      claimsFacadeSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(await service.appendDidDocSyncStatus([])).toEqual([]);
    });

    it('should return not changed list when UserClaims is empty', async () => {
      claimsFacadeSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(
        await service.appendDidDocSyncStatus([{ claimType: '123' }] as any[])
      ).toEqual([{ claimType: '123', isSynced: false }] as any[]);
    });

    it('should return list with object containing isSynced property', async () => {
      const claimType = createClaimType('123');
      claimsFacadeSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType }])
      );
      expect(
        await service.appendDidDocSyncStatus([
          { claimType },
          { claimType: createClaimType('111') },
        ] as any[])
      ).toEqual([
        { claimType, isSynced: true },
        { claimType: createClaimType('111'), isSynced: false },
      ] as any[]);
    });

    it('should not change list when claimType do not match', async () => {
      claimsFacadeSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType: createClaimType('12') }])
      );

      expect(
        await service.appendDidDocSyncStatus([
          { claimType: createClaimType('123') },
        ] as any[])
      ).toEqual([
        { claimType: createClaimType('123'), isSynced: false },
      ] as any[]);
    });
  });
});

const createClaimType = (value: string) => {
  return `${value}.${NamespaceType.Role}`;
};
