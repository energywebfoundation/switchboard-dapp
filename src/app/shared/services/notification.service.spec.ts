import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { EnrolmentsFacadeService } from '@state';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('NotificationService', () => {
  let service: NotificationService;
  let claimsFacadeSpy;
  let assetsFacadeServiceSpy;
  let enrolmentFacadeSpy: EnrolmentsFacadeService;

  const setUp = () => {
    assetsFacadeServiceSpy.getOfferedAssets.and.returnValue(
      Promise.resolve([{}, {}])
    );

    spyOnProperty(enrolmentFacadeSpy, 'notSyncedAmount$', 'get').and.returnValue(
      of(1)
    );
    spyOnProperty(enrolmentFacadeSpy, 'pendingApprovalAmount$', 'get').and.returnValue(
      of(3)
    );
  };
  beforeEach(() => {
    assetsFacadeServiceSpy = jasmine.createSpyObj('AssetsFacadeService', [
      'getOfferedAssets',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AssetsFacadeService, useValue: assetsFacadeServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockStore()
      ],
    });
    service = TestBed.inject(NotificationService);
    enrolmentFacadeSpy = TestBed.inject(EnrolmentsFacadeService);
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

  it('should get number of not synced DID Docs when initializing',  (done) => {
    setUp();

    service.pendingDidDocSync.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });

  it('should get number of pending approvals when initializing',  (done) => {
    setUp();

    service.pendingApproval.subscribe((v) => {
      expect(v).toEqual(3);
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
