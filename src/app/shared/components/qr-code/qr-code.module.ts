import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeDirective } from './directives/qr-code.directive';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { QrCodeModule as QrCode } from 'ng-qrcode';

@NgModule({
  declarations: [QrCodeDirective, QrCodeComponent],
  imports: [
    CommonModule,
    QrCode,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [QrCodeDirective],
})
export class QrCodeModule {}
