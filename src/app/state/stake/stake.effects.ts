import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { StakeState } from './stake.reducer';
import * as StakeActions from './stake.actions';
import { catchError, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { combineLatest, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { StakingPoolServiceFacade } from '../../shared/services/staking/staking-pool-service-facade';
import * as PoolActions from '../pool/pool.actions';
import { Provider } from './models/provider.interface';
import { mapToProviders } from '../../operators/map-providers/map-to-providers';


@Injectable()
export class StakeEffects {
  initStakingPoolService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPool),
      switchMap(() =>
        from(this.stakingService.init())
          .pipe(
            mergeMap(() => {
              return [PoolActions.initPool(), PoolActions.getAccountBalance()];
            })
          )
      )
    )
  );

  launchStakingPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.launchStakingPool),
      tap(() => this.loadingService.show()),
      switchMap(({pool}) =>
        this.stakingService.launchStakingPool(pool)
          .pipe(
            map(() => {
              this.toastr.success(`You successfully created a staking pool for ${pool.org}`);
              this.dialog.closeAll();
            }),
            catchError(err => {
              console.error(err);
              this.toastr.error('Error occurs while creating staking pool');
              return err;
            }),
            finalize(() => this.loadingService.hide())
          )
      )
    ), {dispatch: false}
  );


  getAllServices$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StakeActions.getAllServices),
        tap(() => this.loadingService.show('Loading list of providers')),
        switchMap(() => {
          return combineLatest([
              this.stakingService.allServices(),
              from(this.iamService.iam.getENSTypesBySearchPhrase({types: ['Org'], search: 'iam.ewc'}))
            ]
          ).pipe(
            mapToProviders(),
            map((providers: Provider[]) => StakeActions.getAllServicesSuccess({providers})),
            finalize(() => this.loadingService.hide())
          );
        }),
      )
  );

  constructor(private actions$: Actions,
              private store: Store<StakeState>,
              private iamService: IamService,
              private loadingService: LoadingService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private stakingService: StakingPoolServiceFacade) {
  }
}
