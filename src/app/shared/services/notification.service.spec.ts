import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { EnrolmentListService } from './enrolment-list/enrolment-list.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let claimsFacadeSpy;
  let assetsFacadeServiceSpy;
  let enrolmentListServiceSpy;

  const setUp = () => {
    assetsFacadeServiceSpy.getOfferedAssets.and.returnValue(
      Promise.resolve([{}, {}])
    );
    enrolmentListServiceSpy.getNotSyncedDIDsDocsList.and.returnValue(
      Promise.resolve([{}])
    );
    claimsFacadeSpy.getNotRejectedClaimsByIssuer.and.returnValue(
      Promise.resolve([{}, {}, {}])
    );
  };
  beforeEach(() => {
    assetsFacadeServiceSpy = jasmine.createSpyObj('AssetsFacadeService', [
      'getOfferedAssets',
    ]);
    enrolmentListServiceSpy = jasmine.createSpyObj('EnrolmentListService', [
      'getNotSyncedDIDsDocsList',
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getNotRejectedClaimsByIssuer',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: AssetsFacadeService, useValue: assetsFacadeServiceSpy },
        { provide: EnrolmentListService, useValue: enrolmentListServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });

  it('should get number of offered assets when initializing', async (done) => {
    setUp();

    await service.init();

    service.assetsOfferedToMe.subscribe((v) => {
      expect(v).toEqual(2);
      done();
    });
  });

  it('should get number of not synced DID Docs when initializing', async (done) => {
    setUp();

    await service.init();

    service.pendingDidDocSync.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });

  it('should get number of pending approvals when initializing', async (done) => {
    setUp();

    await service.init();

    service.pendingApproval.subscribe((v) => {
      expect(v).toEqual(3);
      done();
    });
  });

  it('should increase pending approval', (done) => {
    service.increasePendingApprovalCount();

    service.pendingApproval.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });

  it('should increase pendingDidDocSync', (done) => {
    service.increasePendingDidDocSyncCount();

    service.pendingDidDocSync.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });
  it('should increase assets offered', (done) => {
    service.increaseAssetsOfferedToMeCount();

    service.assetsOfferedToMe.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });
});
