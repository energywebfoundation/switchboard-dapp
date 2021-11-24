import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { IamService } from '../../../shared/services/iam.service';
import { from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Asset, AssetProfile, Profile } from 'iam-client-lib';
import { LoadingService } from '../../../shared/services/loading.service';
import { CancelButton } from '../../../layout/loading/loading.component';
import { Store } from '@ngrx/store';
import { UserClaimActions, UserClaimSelectors } from '@state';

const assetProfilesKey = 'assetProfiles';

@Component({
  selector: 'app-edit-asset-dialog',
  templateUrl: './edit-asset-dialog.component.html',
  styleUrls: ['./edit-asset-dialog.component.scss']
})
export class EditAssetDialogComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(256)])],
    icon: ['', Validators.pattern('https?://.*')],
  });

  private profile: Profile;

  constructor(public dialogRef: MatDialogRef<EditAssetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Asset,
              private fb: FormBuilder,
              private iamService: IamService,
              private loadingService: LoadingService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.store.select(UserClaimSelectors.getUserProfile).subscribe((profile: any) => {
      this.loadingService.hide();
      this.profile = profile;
      this.updateForm(profile);
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  update() {
    if (!this.form.valid) {
      return;
    }
    this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
    from(this.iamService.claimsService.createSelfSignedClaim({
      data: {profile: this.createClaimObjectUpdate()}
    })).pipe(
      takeUntil(this.dialogRef.afterClosed())
    ).subscribe(() => {
      this.store.dispatch(UserClaimActions.updateUserClaims({profile: this.createClaimObjectUpdate()}));
      this.loadingService.hide();
      this.dialogRef.close(true);
    });
  }

  private createClaimObjectUpdate(): Profile {
    return ({
      ...this.profile,
      assetProfiles: {
        ...(this.profile && this.profile.assetProfiles),
        [this.data.id]: {
          ...this.form.getRawValue()
        }
      }
    });
  }

  private updateForm(profile) {
    const assetProfile: AssetProfile = profile && profile[assetProfilesKey] && profile[assetProfilesKey][this.data.id];

    if (!assetProfile) {
      return;
    }

    this.form.patchValue({
      name: assetProfile.name,
      icon: assetProfile.icon
    });
  }
}
