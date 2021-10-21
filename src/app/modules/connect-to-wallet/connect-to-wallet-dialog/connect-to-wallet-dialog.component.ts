import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-to-wallet-dialog',
  templateUrl: './connect-to-wallet-dialog.component.html',
  styleUrls: ['./connect-to-wallet-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectToWalletDialogComponent {
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled);
  isMetamaskExtensionAvailable$ = this.store.select(authSelectors.isMetamaskPresent);

  constructor(private store: Store, @Inject(MAT_DIALOG_DATA) public data: { navigateOnTimeout: boolean }) {
  }

  login(provider: WalletProvider) {
    this.store.dispatch(AuthActions.loginViaDialog({
      provider,
      navigateOnTimeout: this.data?.navigateOnTimeout ?? true
    }));
  }
}
