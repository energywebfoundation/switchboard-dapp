import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss']
})
export class QrCodeScannerComponent {

  constructor(private dialogRef: MatDialogRef<QrCodeScannerComponent>) {
  }

  scanned(result) {
    if (!result) {
      return;
    }
    this.dialogRef.close({value: result.text});
  }
}
