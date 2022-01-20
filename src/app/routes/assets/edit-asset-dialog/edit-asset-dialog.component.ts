import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Asset, AssetProfile, Profile } from 'iam-client-lib';
import { EditAssetService } from './services/edit-asset.service';

const assetProfilesKey = 'assetProfiles';

@Component({
  selector: 'app-edit-asset-dialog',
  templateUrl: './edit-asset-dialog.component.html',
  styleUrls: ['./edit-asset-dialog.component.scss'],
})
export class EditAssetDialogComponent implements OnInit {
  form = this.fb.group({
    name: [
      '',
      Validators.compose([Validators.minLength(3), Validators.maxLength(256)]),
    ],
    icon: ['', Validators.pattern('https?://.*')],
  });

  private profile: Profile;

  constructor(
    private dialogRef: MatDialogRef<EditAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Asset,
    private fb: FormBuilder,
    private editAssetService: EditAssetService
  ) {}

  ngOnInit(): void {
    this.editAssetService.getProfile().subscribe((profile: Profile) => {
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
    this.editAssetService
      .update(this.createClaimObjectUpdate())
      .subscribe((v) => this.dialogRef.close(v));
  }

  private createClaimObjectUpdate(): Profile {
    return {
      ...this.profile,
      assetProfiles: {
        ...(this.profile && this.profile.assetProfiles),
        [this.data.id]: {
          ...this.form.getRawValue(),
        },
      },
    };
  }

  private updateForm(profile: Profile) {
    const assetProfile: AssetProfile =
      profile &&
      profile[assetProfilesKey] &&
      profile[assetProfilesKey][this.data.id];
    if (!assetProfile) {
      return;
    }

    this.form.patchValue({
      name: assetProfile.name,
      icon: assetProfile.icon,
    });
  }
}
