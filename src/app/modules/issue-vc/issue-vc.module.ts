import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewArbitraryCredentialComponent } from './new-arbitrary-credential/new-arbitrary-credential.component';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateFieldsModule } from '../../routes/applications/new-role/components/create-fields/create-fields.module';


@NgModule({
  declarations: [
    NewArbitraryCredentialComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrCodeScannerModule,
    SharedModule,
    CreateFieldsModule
  ],
  exports: [
    NewArbitraryCredentialComponent
  ]
})
export class IssueVcModule {
}
