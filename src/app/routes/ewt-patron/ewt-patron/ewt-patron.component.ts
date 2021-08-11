import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { map, takeUntil } from 'rxjs/operators';
import * as PoolActions from '../../../state/pool/pool.actions';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import swal from 'sweetalert';
import { LoginService } from '../../../shared/services/login/login.service';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent implements OnInit, OnDestroy {
  balance$ = this.store.select(poolSelectors.getBalance);
  performance$ = this.store.select(poolSelectors.getPerformance);
  annualReward$ = this.store.select(poolSelectors.getAnnualReward);
  details$ = this.store.select(poolSelectors.getOrganizationDetails);
  destroy$ = new Subject<void>();

  constructor(private store: Store,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    this.setOrganization();
    if ((await this.loginService.hasSessionRetrieved()) === false) {
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
          this.store.dispatch(PoolActions.setOrganization({organization}));
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
