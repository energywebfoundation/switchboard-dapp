import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAM, WalletProvider } from 'iam-client-lib';
import { VOLTA_CHAIN_ID } from '../../shared/services/iam.service';
import { LoginService } from '../../shared/services/login/login.service';
import { filter } from 'rxjs/operators';

const {version} = require('../../../../package.json');

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  isMetamaskExtensionAvailable = false;
  disableMetamaskButton = false;
  version: string = version;

  private _returnUrl;

  constructor(private route: Router,
              private activeRoute: ActivatedRoute,
              private loginService: LoginService) {
  }

  async ngOnInit() {
    this.activeRoute.queryParams.pipe(
      filter((queryParams) => queryParams && queryParams.returnUrl)
    )
      .subscribe((queryParams: any) => {
        this._returnUrl = queryParams.returnUrl;
      });

    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.loginService.isSessionActive()) {
      this.route.navigate(['dashboard']);
    }

    // Check metamask availability
    const {isMetamaskPresent, chainId} = await IAM.isMetamaskExtensionPresent();
    if (isMetamaskPresent) {
      this.isMetamaskExtensionAvailable = true;

      if (chainId && parseInt(`${chainId}`, 16) !== VOLTA_CHAIN_ID) {
        this.disableMetamaskButton = true;
      }
    }
  }

  async connectToEwKeyManager() {
    return;
    await this.connectToWallet(WalletProvider.EwKeyManager);
  }

  async connectToWalletConnect() {
    await this.connectToWallet(WalletProvider.WalletConnect);
  }

  private async connectToWallet(walletProvider: WalletProvider) {
    this.loginService.waitForSignature(walletProvider, true);
    const isLoggedIn = await this.loginService.login({walletProvider});
    this.loginService.clearWaitSignatureTimer();
    if (isLoggedIn) {
      // Check deep link
      let queryParams;
      if (this._returnUrl) {
        queryParams = {returnUrl: this._returnUrl};
      }

      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard'], {
        state: {data: {fresh: true}},
        queryParams
      });
    } else {
      await this.cleanMe();
    }
  }

  async connectToMetamask() {
    // Proceed with Login Process
    const walletProvider = WalletProvider.MetaMask;
    this.loginService.waitForSignature(walletProvider, true);
    const isLoggedIn = await this.loginService.login({walletProvider, reinitializeMetamask: true});
    this.loginService.clearWaitSignatureTimer();

    if (isLoggedIn) {
      // Check deep link
      let queryParams;
      if (this._returnUrl) {
        queryParams = {returnUrl: this._returnUrl};
      }

      // Navigate to dashboard to initalize user data
      this.route.navigate(['dashboard'], {
        state: {data: {fresh: true}},
        queryParams
      });
    } else {
      await this.cleanMe();
    }
  }

  private async cleanMe() {
    this.loginService.logout();
  }
}
