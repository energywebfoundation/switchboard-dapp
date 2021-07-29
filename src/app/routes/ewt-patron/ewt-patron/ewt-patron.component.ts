import { Component, OnDestroy, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { filter, map, takeUntil } from 'rxjs/operators';
import * as StakeActions from '../../../state/stake/stake.actions';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit, OnDestroy {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);
  destroy$ = new Subject<void>();

  constructor(private store: Store<StakeState>,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.setOrganization();
    this.openLoginDialog();
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }

  private openLoginDialog(): void {
    this.dialog.open(ConnectToWalletDialogComponent, {
      width: '434px',
      panelClass: 'connect-to-wallet',
      backdropClass: 'backdrop-hide-content',
      data: {
        navigateOnTimeout: false
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  private setOrganization(): void {
    this.activatedRoute.queryParams
      .pipe(
        map((params: { org: string }) => params?.org),
        filter<string>(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe((organization) => this.store.dispatch(StakeActions.setOrganization({organization})));
  }
}
