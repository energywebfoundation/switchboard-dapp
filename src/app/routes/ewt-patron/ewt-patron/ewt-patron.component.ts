import { Component, OnDestroy, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { map, takeUntil } from 'rxjs/operators';
import * as StakeActions from '../../../state/stake/stake.actions';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import swal from 'sweetalert';
import { IamService } from '../../../shared/services/iam.service';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit, OnDestroy {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  details$ = this.store.select(stakeSelectors.getOrganizationDetails);
  destroy$ = new Subject<void>();

  constructor(private store: Store<StakeState>,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private iamService: IamService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {

    this.setOrganization();
    if (!await this.iamService.hasSessionRetrieved()) {
      this.openLoginDialog();
    }
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
        takeUntil(this.destroy$)
      )
      .subscribe((organization) => {
        if (organization) {
          this.store.dispatch(StakeActions.setOrganization({organization}));
        } else {
          swal({
            title: 'Stake',
            text: 'URL is invalid. \n Url should contain org name. \n For example: ?org=example.iam.ewc',
            icon: 'error',
            buttons: {},
            closeOnClickOutside: false
          });
        }
      });
  }
}
