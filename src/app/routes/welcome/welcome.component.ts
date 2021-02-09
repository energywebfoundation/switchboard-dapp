import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAM, WalletProvider } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService, VOLTA_CHAIN_ID } from 'src/app/shared/services/iam.service';

import { version } from '../../../../package.json';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isMetamaskExtensionAvailable = false;
  disableMetamaskButton = false;
  version: string = version;

  private _returnUrl = undefined;

  constructor(private route: Router, 
    private activeRoute: ActivatedRoute,
    private iamService: IamService, 
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  async ngOnInit() {
    this.activeRoute.queryParams.subscribe((queryParams: any) => {
      if (queryParams && queryParams.returnUrl) {
        this._returnUrl = queryParams.returnUrl;
      }
    });

    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.iamService.getLoginStatus()) {
      this.route.navigate(['dashboard']);
    }

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
    await this.connectToWallet(WalletProvider.WalletConnect);
  }

  private async connectToWallet(walletProvider: WalletProvider) {
    this.iamService.waitForSignature(walletProvider, true);
    let isLoggedIn = await this.iamService.login(walletProvider);
    this.iamService.clearWaitSignatureTimer();
    if (isLoggedIn) {
      // Check deep link
      let queryParams = undefined;
      if (this._returnUrl) {
        queryParams = { returnUrl: this._returnUrl };
      }

      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard'], { 
        state: { data: { fresh: true }},
        queryParams: queryParams
      });
    }
    else {
      await this.cleanMe();
    }
  }

  async connectToMetamask() {
    // Make sure that localStorage is supported
    if (!window.localStorage) {
      this.toastr.error('Local data storage is not supported in this browser.', 'Connect with Metamask');
      return;
    }

    // Proceed with Login Process
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true);
    let isLoggedIn = await this.iamService.login(walletProvider, true);
    this.iamService.clearWaitSignatureTimer();

    if (isLoggedIn) {
      // Set LocalStorage for Metamask
      localStorage['METAMASK_EXT_CONNECTED'] = true;

      // Check deep link
      let queryParams = undefined;
      if (this._returnUrl) {
        queryParams = { returnUrl: this._returnUrl };
      }

      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard'], { 
        state: { data: { fresh: true }},
        queryParams: queryParams
      });
    }
    else {
      await this.cleanMe();
    }
  }
  
  private async cleanMe() {
    this.iamService.logoutAndRefresh();
  }
}
