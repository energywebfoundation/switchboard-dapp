import { TestBed } from '@angular/core/testing';

import { EditAssetService } from './edit-asset.service';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { dialogSpy, toastrSpy } from '@tests';
import { MatDialogRef } from '@angular/material/dialog';
import { UserClaimSelectors } from '@state';

describe('EditAssetService', () => {
  let service: EditAssetService;
  let claimsFacadeSpy = jasmine.createSpyObj(ClaimsFacadeService, ['createSelfSignedClaim']);
  let mockStore: MockStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ClaimsFacadeService, useValue: claimsFacadeSpy},
        provideMockStore(),
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: MatDialogRef, useValue: dialogSpy},
      ]
    });
    service = TestBed.inject(EditAssetService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if getProfile returns profile from store', (done) => {
    mockStore.overrideSelector(UserClaimSelectors.getUserProfile, {assetProfiles: {}});

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual({assetProfiles: {}});
      done();
    });
  });
});
