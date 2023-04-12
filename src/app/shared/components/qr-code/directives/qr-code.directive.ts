import { Directive, HostListener, Input } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { QrCodeDialog } from '../models/qr-code-dialog.interface';
import { QrCodeData } from '../../qr-code-scanner/models/qr-code-data.interface';

@Directive({
  selector: '[appQrCode]',
})
export class QrCodeDirective {
  @Input() data: QrCodeData;
  @Input() header: string;
  constructor(private dialog: MatDialog) {}

  @HostListener('click', ['$event'])
  onClick() {
    this.dialog.open<QrCodeComponent, unknown, QrCodeDialog>(QrCodeComponent, {
      width: '500px',
      data: {
        header: this.header,
        qrCodeData: this.data,
      },
      maxWidth: '100%',
    });
  }
}
