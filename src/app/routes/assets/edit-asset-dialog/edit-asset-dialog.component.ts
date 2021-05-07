import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { IamService } from '../../../shared/services/iam.service';
import { from } from 'rxjs';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { Asset } from 'iam-client-lib';
import { LoadingService } from '../../../shared/services/loading.service';
import { CancelButton } from '../../../layout/loading/loading.component';

interface IAssetProfile {
  name?: string;
  icon?: string;
}

const assetProfilesKey = 'asset-profiles';

@Component({
  selector: 'app-edit-asset-dialog',
  templateUrl: './edit-asset-dialog.component.html',
  styleUrls: ['./edit-asset-dialog.component.scss']
})
export class EditAssetDialogComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.minLength(3)],
    icon: ['', Validators.pattern('https?://.*')],
  });

  private assetProfiles: { [key: string]: IAssetProfile };

  constructor(public dialogRef: MatDialogRef<EditAssetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Asset,
              private fb: FormBuilder,
              private iamService: IamService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadingService.show();
    from(this.iamService.iam.getUserClaims()).pipe(
      flatMap((data) => data.filter(claim => !!claim.profile)),
      map(claim => claim.profile && claim.profile)
    ).subscribe((profiles: any) => {
      this.loadingService.hide();
      this.assetProfiles = profiles;
      this.updateForm(profiles);
    });
  }

  close() {
    this.dialogRef.close();
  }

  update() {
    if (!this.form.valid) {
      return;
    }
    this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
    from(this.iamService.iam.createSelfSignedClaim({
      data: this.createClaimObjectUpdate()
    })).pipe(
      takeUntil(this.dialogRef.afterClosed())
    ).subscribe((next) => {
      this.loadingService.hide();
      this.close();
    });
  }

  private createClaimObjectUpdate() {
    return ({
      profile: {
        ...this.assetProfiles,
        [assetProfilesKey]: {
          ...this.assetProfiles[assetProfilesKey],
          [this.data.id]: {
            ...this.form.getRawValue()
          }
        }
      }
    });
  }

  private updateForm(profile) {
    const assetProfile: IAssetProfile = profile[assetProfilesKey] && profile[assetProfilesKey][this.data.id];
    this.form.patchValue({
      name: assetProfile.name,
      icon: assetProfile.icon
    });
  }

}
