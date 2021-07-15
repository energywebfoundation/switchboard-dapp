import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { StakeState } from './stake.reducer';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import * as StakeActions from './stake.actions';
import { catchError, filter, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { utils } from 'ethers';
import { Stake, StakeStatus, StakingPool, StakingPoolService } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import { ActivatedRoute } from '@angular/router';

import swal from 'sweetalert';
const {formatEther, parseEther} = utils;

@Injectable()
export class StakeEffects {
  private stakingPoolService: StakingPoolService;
  private pool: StakingPool;

  initStakingPoolService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPool),
      switchMap(() =>
        from(StakingPoolService.init(this.iamService.iam.getSigner()))
          .pipe(
            mergeMap((stakingPoolServ) => {
              this.stakingPoolService = stakingPoolServ;
              this.dialog.closeAll();
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

  invalidUrl = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPoolSuccess),
      switchMap(() =>
        this.activatedRoute.queryParams.pipe(
          map((params: { org: string }) => params?.org),
          filter(v => !v),
          map(() => {
            swal({
              title: 'Stake',
              text: 'URL is invalid. \n Url should contain org name. \n For example: ?org=example.iam.ewc',
              icon: 'error',
              buttons: {},
              closeOnClickOutside: false
            });
          })
        )
      )
    ),
    {dispatch: false}
  );



  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.setOrganization),
      switchMap(({organization}) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            mergeMap((pool: StakingPool) => {
              this.pool = pool;
              return [StakeActions.getStake()];
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
                filter<Stake>(Boolean),
                mergeMap((stake) => {
                    const actions = [StakeActions.getStakeSuccess({stake})];
                    if (stake.status !== StakeStatus.NONSTAKING) {
                      return [...actions, StakeActions.checkReward()];
                    }
                    return actions;
                  }
                )
              )
            )
          )
      )
    )
  );

  putStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.putStake),
      tap(() => this.loadingService.show()),
      switchMap(({amount}) =>
        from(this.pool.putStake(parseEther(amount)))
          .pipe(
            mergeMap(() => {
              this.dialog.open(StakeSuccessComponent, {
                width: '400px',
                maxWidth: '100%',
                disableClose: true,
                backdropClass: 'backdrop-shadow'
              });
              return [StakeActions.getAccountBalance(), StakeActions.checkReward(), StakeActions.getStake()];
            }),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawReward),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        from(this.pool.requestWithdraw())
          .pipe(
            switchMap(() =>
              from(this.pool.withdraw()).pipe(
                mergeMap(() => [StakeActions.withdrawRewardSuccess(), StakeActions.getStake()]),
                catchError(err => {
                  console.error(err);
                  return of(StakeActions.withdrawRewardFailure({err}));
                }),
                finalize(() => this.loadingService.hide())
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

  launchStakingPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.launchStakingPool),
      switchMap(() => from(this.stakingPoolService.launchStakingPool({
        org: '',
        minStakingPeriod: 1000,
        patronRewardPortion: 10,
        patronRoles: [],
        principal: parseEther('100')
      })))
    ), {dispatch: false}
  );


  getAllServices = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StakeActions.getAllServices),
        switchMap(() => from(this.stakingPoolService.allServices()).pipe(map((service) => console.log(service))))
      ), {dispatch: false}
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
