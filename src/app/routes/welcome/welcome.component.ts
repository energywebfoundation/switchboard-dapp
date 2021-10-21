import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletProvider } from 'iam-client-lib';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as authSelectors from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { IamService } from '../../shared/services/iam.service';

const {version} = require('../../../../package.json');

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled);
  isMetamaskExtensionAvailable$ = this.store.select(authSelectors.isMetamaskPresent);
  version: string = version;

  private _returnUrl;

  constructor(private route: Router,
              private activeRoute: ActivatedRoute,
              private store: Store,
              private iamService: IamService) {
  }

  async ngOnInit() {
    this.tryToLoginWithPrivateKey();
    this.activeRoute.queryParams.pipe(
      filter((queryParams) => queryParams && queryParams.returnUrl)
    )
      .subscribe((queryParams: any) => {
        this._returnUrl = queryParams.returnUrl;
      });

    // Immediately navigate to dashboard if user is currently logged-in to walletconnect
    if (this.iamService.isSessionActive()) {
      this.route.navigate(['dashboard']);
    }
  }

  connectToWalletConnect() {
    this.login(WalletProvider.WalletConnect);
  }

  connectToMetamask() {
    this.login(WalletProvider.MetaMask);
  }

  connectToEKC() {
    this.login(WalletProvider.EKC);
  }

  private login(provider: WalletProvider) {
    this.store.dispatch(AuthActions.welcomeLogin({provider, returnUrl: this._returnUrl}));
  }

  private tryToLoginWithPrivateKey() {
    if (window.localStorage.getItem('PrivateKey')) {
      console.log('Found PrivateKey. Using to login.');
      this.login(WalletProvider.PrivateKey);
    }
  }
}
