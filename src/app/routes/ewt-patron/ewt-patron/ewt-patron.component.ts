import { Component, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);

  constructor(private dialog: MatDialog, private store: Store<StakeState>) {
  }

  ngOnInit() {
    this.dialog.open(LoginDialogComponent, {
      width: '434px',
      panelClass: 'connect-to-wallet',
      backdropClass: 'backdrop-hide-content',
      maxWidth: '100%',
      disableClose: true
    });
  }

}
