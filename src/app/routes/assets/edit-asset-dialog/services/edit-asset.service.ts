import { Injectable } from '@angular/core';
import { Profile } from 'iam-client-lib';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserClaimActions, UserClaimSelectors } from '@state';
import { Store } from '@ngrx/store';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';
import { MatDialogRef } from '@angular/material/dialog';
import { EditAssetDialogComponent } from '../edit-asset-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class EditAssetService {

  constructor(private claimFacade: ClaimsFacadeService,
              private store: Store,
              private toastr: SwitchboardToastrService,
              private dialogRef: MatDialogRef<EditAssetDialogComponent>) {
  }

  getProfile(): Observable<Profile> {
    return this.store.select(UserClaimSelectors.getUserProfile).pipe(take(1));
  }

  update(profile: Profile) {
    this.claimFacade.createSelfSignedClaim({
      data: {profile}
    }).subscribe(() => {
      this.store.dispatch(UserClaimActions.updateUserClaims({profile: profile}));
      this.toastr.success('Successfully updated Asset data');
      this.dialogRef.close(true);
    }, error => {
      console.error(error);
      this.toastr.error(error?.message);
    });
  }
}
