import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Asset } from 'iam-client-lib';

@Component({
  selector: 'app-did-qr-code',
  templateUrl: './did-qr-code.component.html',
  styleUrls: ['./did-qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DidQrCodeComponent {
  get did() {
    return this.data.id;
  }

  constructor(
    public dialogRef: MatDialogRef<DidQrCodeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Asset
  ) {}
}
