import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import { map, takeUntil } from 'rxjs/operators';
import * as PoolActions from '../../../state/pool/pool.actions';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import swal from 'sweetalert';
import { IamService } from '../../../shared/services/iam.service';
import * as AuthActions from '../../../state/auth/auth.actions';

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
              private activatedRoute: ActivatedRoute,
              private iamService: IamService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    this.setOrganization();
    this.login();
  }

  private login() {
    if (this.iamService.isSessionActive()) {
      this.store.dispatch(AuthActions.reinitializeAuthForPatron());
    } else {
      this.store.dispatch(AuthActions.openLoginDialog());
    }
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
