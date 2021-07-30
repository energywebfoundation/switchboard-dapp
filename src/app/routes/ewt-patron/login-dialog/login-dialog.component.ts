import { Component, Inject } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled);
  isMetamaskExtensionAvailable$ = this.store.select(authSelectors.isMetamaskPresent);

  constructor(private store: Store, @Inject(MAT_DIALOG_DATA) public data: { stakeAmount: string }) {
  }

  connectToWalletConnect() {
    this.loginWithProvider(WalletProvider.WalletConnect);
  }

  connectToMetamask() {
    this.loginWithProvider(WalletProvider.MetaMask);
  }

  loginWithProvider(provider: WalletProvider) {
    this.data?.stakeAmount ? this.loginAndStake(provider) : this.login(provider);
  }

  private login(provider: WalletProvider) {
    this.store.dispatch(AuthActions.login({provider}));
  }

  private loginAndStake(provider: WalletProvider) {
    this.store.dispatch(AuthActions.loginAndStake({provider, amount: this.data.stakeAmount}));
  }

}
