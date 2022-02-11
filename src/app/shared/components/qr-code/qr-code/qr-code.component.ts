import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QrCodeDialog } from '../models/qr-code-dialog.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrCodeComponent implements OnInit {
  parsedValue: string;
  get header() {
    return this.data.header;
  }
  defaultText = 'QR-Code';
  constructor(@Inject(MAT_DIALOG_DATA) private data: QrCodeDialog) {}

  ngOnInit() {
    this.parsedValue = JSON.stringify(this.data.qrCodeData);
  }
}
