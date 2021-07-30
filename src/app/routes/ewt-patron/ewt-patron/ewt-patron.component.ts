import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);

  constructor(private store: Store<StakeState>, private dialog: MatDialog) {
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '434px',
      backdropClass: 'backdrop-shadow',
      maxWidth: '100%',
    });
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
