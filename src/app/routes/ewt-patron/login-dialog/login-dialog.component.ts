import { Component } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';
import * as authSelectors from '../../../state/auth/auth.selectors';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled);
  isMetamaskExtensionAvailable$ = this.store.select(authSelectors.isMetamaskPresent);

  constructor(private store: Store) {
  }

  connectToWalletConnect() {
    this.login(WalletProvider.WalletConnect);
  }

  connectToMetamask() {
    this.login(WalletProvider.MetaMask);
  }

  private login(provider: WalletProvider) {
    this.store.dispatch(AuthActions.login({provider}));
  }

}
