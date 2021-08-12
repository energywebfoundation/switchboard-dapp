import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletProvider } from 'iam-client-lib';
import { LoginService } from '../../shared/services/login/login.service';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as authSelectors from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';

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
  }

  connectToWalletConnect() {
    this.login(WalletProvider.WalletConnect);
  }

  connectToMetamask() {
    this.login(WalletProvider.MetaMask);
  }

  private login(provider: WalletProvider) {
    this.store.dispatch(AuthActions.welcomeLogin({provider, returnUrl: this._returnUrl}));
  }
}
