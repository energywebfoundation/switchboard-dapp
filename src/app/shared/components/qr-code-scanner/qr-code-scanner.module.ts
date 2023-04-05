import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeScannerComponent } from './components/qr-code-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrCodeScannerDirective } from './directives/qr-code-scanner.directive';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

@NgModule({
  declarations: [QrCodeScannerComponent, QrCodeScannerDirective],
  imports: [CommonModule, ZXingScannerModule, MatDialogModule],
  exports: [QrCodeScannerDirective],
})
export class QrCodeScannerModule {}
