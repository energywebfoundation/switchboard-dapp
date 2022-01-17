import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConnectButtonsComponent } from './connect-buttons/connect-buttons.component';
import { MatIconModule } from '@angular/material/icon';
import { EkcSettingsComponent } from './ekc-settings/ekc-settings.component';
import { MatInputModule } from '@angular/material/input';
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
