import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';
import { combineLatest } from 'rxjs';
import { AuthSelectors, UserClaimSelectors } from '@state';
import { map } from 'rxjs/operators';
import { WalletProvider } from 'iam-client-lib';

const ICON_MAP = new Map()
  .set('Azure', 'assets/img/icons/azure-logo-icon.svg')
  .set(WalletProvider.WalletConnect, 'assets/img/icons/wallet-connect-icon.svg')
  .set(WalletProvider.EwKeyManager, 'assets/img/icons/key-manager-icon.svg')
  .set(WalletProvider.MetaMask, 'assets/img/icons/metamask-logo.svg');

@Component({
  selector: 'app-staking-header',
  templateUrl: './staking-header.component.html',
  styleUrls: ['./staking-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StakingHeaderComponent {
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);
  accountInfo$ = combineLatest([
    this.store.select(AuthSelectors.getWalletProvider),
    this.store.select(AuthSelectors.getAccountInfo),
    this.store.select(UserClaimSelectors.getUserName),
  ]).pipe(map(([wallet, accountInfo, userName]) => {
    return {
      wallet,
      userName,
      accountInfo
    };
  }));

  constructor(private store: Store) {
  }

  getIcon(provider: WalletProvider) {
    return ICON_MAP.get(provider);
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
