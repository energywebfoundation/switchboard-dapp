import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  OwnedEnrolmentsActions,
  OwnedEnrolmentsSelectors,
  RequestedEnrolmentsActions,
  RequestedEnrolmentsSelectors,
} from '@state';

describe('NotificationService', () => {
  let service: NotificationService;
  let claimsFacadeSpy;
  let assetsFacadeServiceSpy;
  let store: MockStore;

  const setUp = () => {
    assetsFacadeServiceSpy.getOfferedAssets.and.returnValue(
      Promise.resolve([{}, {}])
    );

    store.overrideSelector(OwnedEnrolmentsSelectors.getNotSyncedAmount, 1);
    store.overrideSelector(
      RequestedEnrolmentsSelectors.getPendingEnrolmentsAmount,
      3
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
        provideMockStore(),
      ],
    });
    service = TestBed.inject(NotificationService);
    store = TestBed.inject(MockStore);
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

    service.pendingDidDocSync.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });

  it('should get number of pending approvals when initializing', async (done) => {
    setUp();

    service.pendingApproval.subscribe((v) => {
      expect(v).toEqual(3);
      done();
    });
  });

  it('should refresh requested enrolments list after approving or rejecting', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    service.updatePendingApprovalList();
    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      RequestedEnrolmentsActions.getEnrolmentRequests()
    );
  });

  it('should refresh owned enrolments list after publishing', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    service.updatePendingPublishList();
    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      OwnedEnrolmentsActions.getOwnedEnrolments()
    );
  });

  it('should increase assets offered', (done) => {
    service.increaseAssetsOfferedToMeCount();

    service.assetsOfferedToMe.subscribe((v) => {
      expect(v).toEqual(1);
      done();
    });
  });
});
