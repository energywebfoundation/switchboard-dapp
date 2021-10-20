import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewArbitraryCredentialComponent } from './new-arbitrary-credential/new-arbitrary-credential.component';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    NewArbitraryCredentialComponent
  ],
  imports: [
    CommonModule,
    QrCodeScannerModule,
    SharedModule
  ],
  exports: [
    NewArbitraryCredentialComponent
  ]
})
export class IssueVcModule {
}
