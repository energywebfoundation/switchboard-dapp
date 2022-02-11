import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { QrCodeDialog } from '../models/qr-code-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  constructor(private dialog: MatDialog) {}

  open(data: QrCodeDialog) {
    this.dialog.open(QrCodeComponent, {
      width: '400px',
      data,
      maxWidth: '100%',
    });
  }
}
