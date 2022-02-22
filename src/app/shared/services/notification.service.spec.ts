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
  beforeEach(() => {
    assetsFacadeServiceSpy = jasmine.createSpyObj('AssetsFacadeService', [
      'getOfferedAssets',
    ]);
    enrolmentListServiceSpy = jasmine.createSpyObj('EnrolmentListService', [
      'appendDidDocSyncStatus', 'isPendingSync'
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getUserClaims',
    ]);
    TestBed.configureTestingModule({
      providers: [
        { provide: AssetsFacadeService, useValue: assetsFacadeServiceSpy },
        { provide: EnrolmentListService, useValue: enrolmentListServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy }
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });
});
