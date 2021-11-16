import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConnectButtonsComponent } from './connect-buttons/connect-buttons.component';


@NgModule({
  declarations: [
    ConnectToWalletDialogComponent,
    ConnectButtonsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ConnectToWalletDialogComponent,
    ConnectButtonsComponent
  ]
})
export class ConnectToWalletModule {
}
