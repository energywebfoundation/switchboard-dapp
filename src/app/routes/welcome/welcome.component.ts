import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderType } from 'iam-client-lib';
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

  constructor(private activeRoute: ActivatedRoute,
              private store: Store) {
  }

  async ngOnInit() {
    this.tryToLoginWithPrivateKey();
    this.activeRoute.queryParams
      .pipe(filter((queryParams) => queryParams && queryParams.returnUrl))
      .subscribe((queryParams: any) => {
        this._returnUrl = queryParams.returnUrl;
      });

    this.store.dispatch(AuthActions.navigateWhenSessionActive());
  }

  login(provider: ProviderType) {
    this.store.dispatch(AuthActions.welcomeLogin({provider, returnUrl: this._returnUrl}));
  }

  private tryToLoginWithPrivateKey() {
    if (window.localStorage.getItem('PrivateKey')) {
      console.log('Found PrivateKey. Using to login.');
      this.login(ProviderType.PrivateKey);
    }
  }
}
