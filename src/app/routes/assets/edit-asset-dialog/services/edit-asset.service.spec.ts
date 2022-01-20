import { TestBed } from '@angular/core/testing';

import { EditAssetService } from './edit-asset.service';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { dialogSpy, toastrSpy } from '@tests';
import { MatDialogRef } from '@angular/material/dialog';
import { UserClaimActions, UserClaimSelectors } from '@state';
import { of, throwError } from 'rxjs';

describe('EditAssetService', () => {
  let service: EditAssetService;
  const claimsFacadeSpy = jasmine.createSpyObj(ClaimsFacadeService, [
    'createSelfSignedClaim',
  ]);
  let mockStore: MockStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockStore(),
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
    });
    service = TestBed.inject(EditAssetService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if getProfile returns profile from store', (done) => {
    mockStore.overrideSelector(UserClaimSelectors.getUserProfile, {
      assetProfiles: {},
    });

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual({ assetProfiles: {} });
      done();
    });
  });

  it('should check if action is dispatched and message successful is displayed', (done) => {
    claimsFacadeSpy.createSelfSignedClaim.and.returnValue(of(''));
    const dispatchSpy = spyOn(mockStore, 'dispatch');

    service.update({}).subscribe((v) => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        UserClaimActions.updateLocalStateUserClaims({ profile: {} })
      );
      expect(toastrSpy.success).toHaveBeenCalled();
      expect(v).toBeTrue();
      done();
    });
  });

  it('should check if error is thrown when updating', (done) => {
    claimsFacadeSpy.createSelfSignedClaim.and.returnValue(
      throwError({ message: 'error' })
    );

    service.update({}).subscribe((v) => {
      expect(toastrSpy.error).toHaveBeenCalled();
      expect(v).toBeFalse();
      done();
    });
  });
});
