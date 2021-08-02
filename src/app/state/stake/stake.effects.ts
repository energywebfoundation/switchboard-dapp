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
import { Stake, StakeStatus } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import * as stakeSelectors from './stake.selectors';
import { ToastrService } from 'ngx-toastr';
import { WithdrawComponent } from '../../routes/ewt-patron/withdraw/withdraw.component';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';
import { StakingService } from '../../shared/services/staking/staking.service';

const {formatEther, parseEther} = utils;

@Injectable()
export class StakeEffects {
  initStakingPoolService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPool),
      switchMap(() =>
        from(this.stakingService.init())
          .pipe(
            mergeMap(() => {
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
        this.createPool(organization)
      )
    )
  );

  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.setOrganization),
      filter(() => Boolean(this.stakingService.getPool())),
      switchMap(({organization}) =>
        this.createPool(organization)
      )
    )
  );

  getStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getStake),
      switchMap(() =>
        from(this.iamService.getAddress())
          .pipe(
            switchMap((address) => from(this.stakingService.getPool().getStake(address))
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
        this.store.select(stakeSelectors.getBalance),
        this.store.select(stakeSelectors.isStakingDisabled)
      ),
      filter(([, , isStakeDisabled]) => {
        if (isStakeDisabled) {
          this.toastr.error('You can not stake to this provider because you already staked to it!');
        }
        return !isStakeDisabled;
      }),
      tap(() => this.loadingService.show()),
      switchMap(([{amount}, balance]) => {
          const amountLesserThanBalance = parseInt(amount, 10) <= parseInt(balance, 10);
          if (!amountLesserThanBalance) {
            this.toastr.error('You try to stake higher amount of tokens that your account have. Will be used your balance instead');
          }

          return from(this.stakingService.getPool().putStake(amountLesserThanBalance ? parseEther(amount) : parseEther(balance)))
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
        from(this.stakingService.getPool().withdrawalDelay())
          .pipe(
            map(withdrawalDelay => () => delay(withdrawalDelay as any)),
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
        from(this.stakingService.getPool().requestWithdraw())
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
        from(this.stakingService.getPool().withdraw()).pipe(
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
        from(this.stakingService.getPool().checkReward()).pipe(
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
      switchMap(() =>
        from(this.iamService.getBalance())
          .pipe(
            map((balance) => balance.toString()),
            map(balance => StakeActions.getAccountSuccess({balance}))
          )
      )
    )
  );

  getOrganizationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.getOrganizationDetails),
      withLatestFrom(this.store.select(stakeSelectors.getOrganization)),
      switchMap(([, organization]) => from(this.iamService.getDefinition(organization)).pipe(
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
        from(this.stakingService.getStakingPoolService().launchStakingPool(pool))
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
        switchMap(() => from(this.stakingService.getStakingPoolService().allServices()).pipe(map((service) => console.log(service))))
      ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<StakeState>,
              private iamService: IamService,
              private loadingService: LoadingService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private stakingService: StakingService) {
  }

  private createPool(organization) {
    return from(this.stakingService.createPool(organization))
      .pipe(
        mergeMap((pool) => {
          if (!pool) {
            this.toastr.error(`Organization ${organization} do not exist as a provider.`);
            return [StakeActions.getOrganizationDetails()];
          }
          return [StakeActions.getStake(), StakeActions.getOrganizationDetails()];
        })
      );
  }
}
