import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { StakeState } from './stake.reducer';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import * as StakeActions from './stake.actions';
import * as stakeSelectors from './stake.selectors';
import { catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { utils } from 'ethers';
import { StakingService } from '../../shared/services/staking/staking.service';
import { StakingPool, StakingPoolService } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import { ActivatedRoute } from '@angular/router';

const {formatEther, parseEther} = utils;

@Injectable()
export class StakeEffects {
  private stakingPoolService: StakingPoolService;
  private pool: StakingPool;

  getOrganizationName$ = createEffect(() =>
      this.actions$.pipe(
        ofType(StakeActions.initStakingPool),
      ),
    {dispatch: false}
  );


  initStakingPoolService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPool),
      switchMap(() =>
        from(StakingPoolService.init(this.iamService.iam.getSigner()))
          .pipe(
            mergeMap((stakingPoolServ) => {
              this.stakingPoolService = stakingPoolServ;
              return [StakeActions.initStakingPoolSuccess(), StakeActions.getAccountBalance()];
            })
          )
      )
    )
  );

  initPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPoolSuccess),
      switchMap(() =>
        this.activatedRoute.queryParams.pipe(
          map((params: { org: string }) => params?.org),
          filter<string>(Boolean),
          map((organization) => StakeActions.setOrganization({organization}))
        )
      )
    )
  );

  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.setOrganization),
      switchMap(({organization}) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            mergeMap((pool: StakingPool) => {
              this.pool = pool;
              return [StakeActions.checkReward(), StakeActions.getStake()];
            })
          )
      )
    )
  );

  getStake = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getStake),
      switchMap(() =>
        from(this.iamService.iam.getSigner().getAddress())
          .pipe(
            switchMap((address) => from(this.pool.getStake(address))
              .pipe(
                map((stake) => StakeActions.getStakeSuccess({stake}))
              )
            ))
      )
    )
  );

  putStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.putStake),
      switchMap(({amount}) =>
        from(this.pool.putStake(parseEther(amount)))
          .pipe(
            mergeMap(() => {
              this.dialog.open(StakeSuccessComponent, {
                width: '400px',
                maxWidth: '100%',
                disableClose: true
              });
              return [StakeActions.getAccountBalance(), StakeActions.checkReward()];
            })
          )
      )
    )
  );

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawReward),
      switchMap(() =>
        from(this.pool.requestWithdraw())
          .pipe(
            switchMap(() =>
              from(this.pool.withdraw()).pipe(
                mergeMap(() => [StakeActions.withdrawRewardSuccess(), StakeActions.getStake()]),
                catchError(err => {
                  console.error(err);
                  return of(StakeActions.withdrawRewardFailure({err}));
                })
              ),
            )
          )
      )
    )
  );


  checkReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.checkReward),
      switchMap(() =>
        from(this.pool.checkReward()).pipe(
          map((reward) => StakeActions.checkRewardSuccess({reward: formatEther(reward as any)})),
          catchError(err => {
            console.error(err);
            return of(StakeActions.checkRewardFailure(err));
          })
        )
      )
    )
  );

  getAccountBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getAccountBalance),
      switchMap(() => from(this.iamService.iam.getSigner().getAddress())
        .pipe(
          switchMap((address: string) =>
            from(this.iamService.iam.getSigner().provider.getBalance(address))
              .pipe(
                map((balance) => formatEther(balance)),
                map(balance => StakeActions.getAccountSuccess({balance}))
              )
          )
        )
      )
    )
  );

  constructor(private actions$: Actions,
              private store: Store<StakeState>,
              private iamService: IamService,
              private activatedRoute: ActivatedRoute,
              private loadingService: LoadingService,
              private toastr: SwitchboardToastrService,
              private dialog: MatDialog) {
  }

}
