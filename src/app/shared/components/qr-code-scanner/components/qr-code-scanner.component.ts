import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { QrCodeData } from '../models/qr-code-data.interface';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss'],
})
export class QrCodeScannerComponent {
  constructor(private dialogRef: MatDialogRef<QrCodeScannerComponent>) {}

  scanned(result: { text: string }) {
    if (!result) {
      return;
    }
    try {
      this.dialogRef.close(JSON.parse(result.text) as QrCodeData);
    } catch (e) {
      console.error(e.message);
    }
  }
}
