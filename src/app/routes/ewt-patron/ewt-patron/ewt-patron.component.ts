import { Component, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);

  constructor(private store: Store<StakeState>, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.dialog.open(ConnectToWalletDialogComponent, {
      width: '434px',
      panelClass: 'connect-to-wallet',
      backdropClass: 'backdrop-hide-content',
      maxWidth: '100%',
      disableClose: true
    });
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
