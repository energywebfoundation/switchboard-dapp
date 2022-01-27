import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { isUrlValidator } from '../../../utils/validators/url/is-url.validator';

@Component({
  selector: 'app-ekc-settings',
  templateUrl: './ekc-settings.component.html',
  styleUrls: ['./ekc-settings.component.scss'],
})
export class EkcSettingsComponent implements OnInit {
  form = new FormControl('', [Validators.required, isUrlValidator()]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private dialogRef: MatDialogRef<EkcSettingsComponent>
  ) {}

  ngOnInit(): void {
    this.setAzureUrl();
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  private setAzureUrl() {
    if (this.data?.url) {
      this.form.setValue(this.data.url);
    }
  }
}
