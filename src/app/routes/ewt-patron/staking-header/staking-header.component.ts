import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';
import { combineLatest } from 'rxjs';
import { AuthSelectors, UserClaimSelectors } from '@state';
import { map } from 'rxjs/operators';

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

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
