import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDidComponent } from './user-did/user-did.component';
import { UserNameComponent } from './user-name/user-name.component';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardModule } from '../../../shared/directives/copy-to-clipboard/copy-to-clipboard.module';
import { DidFormatMinifierModule } from '../../../shared/pipes/did-format-minifier/did-format-minifier.module';
import { UserMenuTriggerComponent } from './user-menu-trigger/user-menu-trigger.component';
import { QrCodeScannerModule } from '../../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { QrCodeModule } from '../../../shared/components/qr-code/qr-code.module';

@NgModule({
  declarations: [UserDidComponent, UserNameComponent, UserMenuTriggerComponent],
  imports: [
    CommonModule,
    MatIconModule,
    CopyToClipboardModule,
    DidFormatMinifierModule,
    QrCodeScannerModule,
    QrCodeModule,
  ],
  exports: [UserDidComponent, UserNameComponent, UserMenuTriggerComponent],
})
export class UserMenuModule {}
