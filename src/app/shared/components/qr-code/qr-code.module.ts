import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeDirective } from './directives/qr-code.directive';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
