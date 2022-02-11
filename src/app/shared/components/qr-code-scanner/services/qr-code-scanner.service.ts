import { Injectable } from '@angular/core';
import { DidBookService } from '../../../../modules/did-book/services/did-book.service';
import { Observable } from 'rxjs';
import { QrCodeData } from '../models/qr-code-data.interface';
import { filter } from 'rxjs/operators';
import { ScanType } from '../models/scan-type.enum';
import { DidBookComponent } from '../../../../modules/did-book/components/did-book/did-book.component';
import { DidBookRecord } from '../../../../modules/did-book/components/models/did-book-record';
import { SwitchboardToastrService } from '../../../services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class QrCodeScannerService {
  constructor(
    private didBookService: DidBookService,
    private toastr: SwitchboardToastrService,
    private dialog: MatDialog
  ) {}

  dataFactory(data: QrCodeData) {
    switch (data.type) {
      case ScanType.User:
        this.handleUserQrCode(data);
        break;
      case ScanType.Asset:
      default:
        console.error('not supported type');
        break;
    }
  }

  private handleUserQrCode(qrCodeData: QrCodeData) {
    if (this.didBookService.exist(qrCodeData.data?.did)) {
      this.toastr.info('This user already exist in Your contact book');
      return;
    }

    this.dialog.open<DidBookComponent, Partial<DidBookRecord>>(
      DidBookComponent,
      {
        width: '600px',
        data: {
          did: qrCodeData.data?.did,
          label: qrCodeData?.data?.label,
        },
        maxWidth: '100%',
        disableClose: true,
      }
    );
  }
}
