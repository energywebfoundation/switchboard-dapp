import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeScannerComponent } from '../components/qr-code-scanner.component';
import { filter } from 'rxjs/operators';
import { QrCodeData } from '../models/qr-code-data.interface';
import { Observable } from 'rxjs';
import { QrCodeScannerService } from '../services/qr-code-scanner.service';

@Directive({
  selector: '[appQrCodeScanner]',
})
export class QrCodeScannerDirective {
  @Input() detect = false;
  @Output() scannedValue = new EventEmitter<QrCodeData>();

  constructor(
    private dialog: MatDialog,
    private qrCodeScannerService: QrCodeScannerService
  ) {}

  @HostListener('click', ['$event'])
  onClick() {
    const afterClosed = this.dialog
      .open<QrCodeScannerComponent, unknown, QrCodeData>(
        QrCodeScannerComponent,
        {
          width: '500px',
          maxHeight: '250px',
          maxWidth: '100%',
        }
      )
      .afterClosed()
      .pipe(filter((data) => !!data?.did && !!data?.type));

    this.handleScannedValue(afterClosed);
    this.detectDefaultBehaviour(afterClosed);
  }

  private handleScannedValue(closed: Observable<QrCodeData>) {
    closed
      .pipe(filter(() => !this.detect))
      .subscribe((data: QrCodeData) => this.scannedValue.emit(data));
  }

  private detectDefaultBehaviour(closed: Observable<QrCodeData>) {
    closed
      .pipe(filter(() => this.detect))
      .subscribe((data: QrCodeData) =>
        this.qrCodeScannerService.dataFactory(data)
      );
  }
}
