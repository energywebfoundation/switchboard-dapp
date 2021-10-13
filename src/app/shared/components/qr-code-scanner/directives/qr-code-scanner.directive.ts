import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeScannerComponent } from '../components/qr-code-scanner.component';

@Directive({
  selector: '[appQrCodeScanner]'
})
export class QrCodeScannerDirective {
  @Output() scannedValue = new EventEmitter<{ did: string }>();

  constructor(private dialog: MatDialog) {
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.dialog.open(QrCodeScannerComponent, {
      width: '500px',
      maxHeight: '250px',
      maxWidth: '100%',
    }).afterClosed().subscribe((value: { did: string }) => {
      this.scannedValue.emit(value);
    });
  }
}
