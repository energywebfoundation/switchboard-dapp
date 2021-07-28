import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ConnectToWalletDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ConnectToWalletDialogComponent
  ]
})
export class ConnectToWalletModule { }
