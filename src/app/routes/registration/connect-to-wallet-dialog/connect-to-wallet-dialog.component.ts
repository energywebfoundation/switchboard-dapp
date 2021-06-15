import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAM, WalletProvider } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { IamService, VOLTA_CHAIN_ID } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-connect-to-wallet-dialog',
  templateUrl: './connect-to-wallet-dialog.component.html',
  styleUrls: ['./connect-to-wallet-dialog.component.scss']
})
export class ConnectToWalletDialogComponent implements OnInit {
  isMetamaskExtensionAvailable = false;
  disableMetamaskButton = false;
  appName: string;

  constructor(private iamService: IamService,
              private spinner: NgxSpinnerService,
              public dialogRef: MatDialogRef<ConnectToWalletDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appName = data.appName;
  }

  async ngOnInit() {
    // Check metamask availability
    let { isMetamaskPresent, chainId } = await IAM.isMetamaskExtensionPresent();
    if (isMetamaskPresent) {
      this.isMetamaskExtensionAvailable = true;

      if (chainId && parseInt(`${chainId}`, 16) !== VOLTA_CHAIN_ID) {
        this.disableMetamaskButton = true;
      }
    }
  }

  async connectToEwKeyManager() {
    await this.connectToWallet(WalletProvider.EwKeyManager);
  }

  async connectToWalletConnect() {
    await this.connectToWallet(WalletProvider.WalletConnect)
  }

  async connectToWallet(walletProvider: WalletProvider) {
    this.iamService.waitForSignature(walletProvider, true);
    let isLoggedIn = await this.iamService.login(walletProvider);
    this.iamService.clearWaitSignatureTimer();

    if (isLoggedIn) {
      // Close Login Dialog
      this.dialogRef.close();
    }
    else {
      await this.cleanMe();
    }
  }

  async connectToMetamask() {
    // Proceed with Login Process
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true);
    let isLoggedIn = await this.iamService.login(walletProvider, true);
    this.iamService.clearWaitSignatureTimer();

    if (isLoggedIn) {
      // Close Login Dialog
      this.dialogRef.close();
    }
    else {
      await this.cleanMe();
    }
  }

  private async cleanMe() {
    this.iamService.logoutAndRefresh();
  }
}
