import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeScannerComponent } from '../components/qr-code-scanner.component';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appQrCodeScanner]'
})
export class QrCodeScannerDirective {
  @Output() scannedValue = new EventEmitter<{ value: string }>();

  constructor(private dialog: MatDialog) {
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.dialog.open(QrCodeScannerComponent, {
      width: '500px',
      maxHeight: '250px',
      maxWidth: '100%',
    }).afterClosed()
      .pipe(
        filter(v => v?.value)
      )
      .subscribe((data: { value: string }) => {
        this.scannedValue.emit(data);
      });
  }
}
