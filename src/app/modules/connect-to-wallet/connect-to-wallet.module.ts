import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ConnectButtonsComponent } from './connect-buttons/connect-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { EkcSettingsComponent } from './ekc-settings/ekc-settings.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConnectToWalletDialogComponent,
    ConnectButtonsComponent,
    EkcSettingsComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [ConnectToWalletDialogComponent, ConnectButtonsComponent],
})
export class ConnectToWalletModule {}
