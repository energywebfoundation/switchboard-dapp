import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { StakeState } from './stake.reducer';
import * as StakeActions from './stake.actions';
import { catchError, delay, filter, finalize, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { utils } from 'ethers';
import { ENSNamespaceTypes, Stake, StakeStatus, StakingPool, StakingPoolService } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import { ActivatedRoute } from '@angular/router';
import * as authSelectors from '../auth/auth.selectors';
import * as stakeSelectors from './stake.selectors';
import { ToastrService } from 'ngx-toastr';
import { WithdrawComponent } from '../../routes/ewt-patron/withdraw/withdraw.component';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';

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
              return [StakeActions.initPool(), StakeActions.getAccountBalance()];
            })
          )
      )
    )
  );

  initPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initPool),
      withLatestFrom(this.store.select(stakeSelectors.getOrganization)),
      filter(([, org]) => Boolean(org)),
      switchMap(([, organization]) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            mergeMap((pool: StakingPool) => {
              if (!pool) {
                this.toastr.error(`Organization ${organization} do not exist as a provider.`);
              }
              this.pool = pool;
              return [StakeActions.getStake(), StakeActions.getOrganizationDetails()];
            })
          )
      )
    )
  );

  // invalidUrl = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(StakeActions.initStakingPoolSuccess),
  //       switchMap(() =>
  //         this.activatedRoute.queryParams.pipe(
  //           map((params: { org: string }) => params?.org),
  //           filter(v => !v),
  //           map(() => {
  //             swal({
  //               title: 'Stake',
  //               text: 'URL is invalid. \n Url should contain org name. \n For example: ?org=example.iam.ewc',
  //               icon: 'error',
  //               buttons: {},
  //               closeOnClickOutside: false
  //             });
  //           })
  //         )
  //       )
  //     ),
  //   {dispatch: false}
  // );


  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.setOrganization),
      filter(() => Boolean(this.pool)),
      switchMap(({organization}) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            mergeMap((pool: StakingPool) => {
              if (!pool) {
                this.toastr.error(`Organization ${organization} do not exist as a provider.`);
              }
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
                    const actions = [StakeActions.getStakeSuccess({stake}), StakeActions.getAccountBalance()];
                    if (stake.status === StakeStatus.STAKING) {
                      return [...actions, StakeActions.checkReward()];
                    }
                    if (stake.status === StakeStatus.WITHDRAWING) {
                      return [
                        ...actions,
                        StakeActions.checkReward(),
                        StakeActions.withdrawRewardSuccess(),
                        StakeActions.displayConfirmationDialog()
                      ];
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
      delay(1000), // todo: remove workaround with actions.
      withLatestFrom(
        this.store.select(authSelectors.isUserLoggedIn),
        this.store.select(stakeSelectors.getBalance),
        this.store.select(stakeSelectors.isStakingDisabled)
      ),
      filter(([, loggedIn]) => {
        if (!loggedIn) {
          this.toastr.error('You can not stake when you are not logged in!');
        }
        return loggedIn;
      }),
      filter(([, , , isStakeDisabled]) => {
        if (isStakeDisabled) {
          this.toastr.error('You can not stake to this provider because you already staked to it!');
        }
        return !isStakeDisabled;
      }),
      tap(() => this.loadingService.show()),
      switchMap(([{amount}, , balance]) => {
          const amountLesserThanBalance = parseInt(amount, 10) <= parseInt(balance, 10);
          if (!amountLesserThanBalance) {
            this.toastr.error('You try to stake higher amount of tokens that your account have. Will be used your balance instead');
          }

          return from(this.pool.putStake(amountLesserThanBalance ? parseEther(amount) : parseEther(balance)))
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
            );
        }
      )
    )
  );

  withdrawalDelay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getWithdrawalDelay),
      switchMap(() =>
        from(this.pool.withdrawalDelay())
          .pipe(
            map(withdrawalDelay => () => delay(withdrawalDelay)),
            map(() => StakeActions.withdrawalDelayExpired()
            ),
            catchError(err => {
              console.error('Could not get withdrawal delay', err);
              return of(StakeActions.getWithdrawalDelayFailure({err}));
            }),
          )
      )
    )
  );

  showProgressBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawRequest, StakeActions.displayConfirmationDialog),
      map(() => {
        this.dialog.open(WithdrawComponent, {
          width: '400px',
          maxWidth: '100%',
          disableClose: true,
          backdropClass: 'backdrop-shadow'
        });
      })
    ), {dispatch: false}
  );

  withdrawRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawRequest),
      switchMap(() =>
        from(this.pool.requestWithdraw())
          .pipe(
            map(() => {
              return StakeActions.getWithdrawalDelay();
            }),
            catchError((err) => {
              console.error(err);
              this.toastr.error('Error occurs while trying to request a withdraw.');
              this.dialog.closeAll();
              return of(StakeActions.withdrawRequestFailure({err}));
            }),
          )
      )
    )
  );

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawReward),
      tap(() => this.loadingService.show('Withdrawing your reward...')),
      switchMap(() =>
        from(this.pool.withdraw()).pipe(
          mergeMap(() => {
            this.dialog.closeAll();
            return [StakeActions.withdrawRewardSuccess(), StakeActions.getStake()];
          }),
          catchError(err => {
            console.error(err);
            return of(StakeActions.withdrawRewardFailure({err}));
          }),
          finalize(() => {
            this.loadingService.hide();
          })
        ),
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

  getOrganizationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getOrganizationDetails),
      withLatestFrom(this.store.select(stakeSelectors.getOrganization)),
      switchMap(([, organization]) => from(this.iamService.iam.getDefinition({
          type: ENSNamespaceTypes.Organization,
          namespace: organization
        })).pipe(
        map((definition: IOrganizationDefinition) => StakeActions.getOrganizationDetailsSuccess({orgDetails: definition})),
        catchError(err => {
          console.error(err);
          return of(StakeActions.getOrganizationDetailsFailure({err}));
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
        from(this.stakingPoolService.launchStakingPool(pool))
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
              private toastr: ToastrService,
              private dialog: MatDialog) {
  }

}
