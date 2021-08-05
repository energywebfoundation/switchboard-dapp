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
import { StakingPoolServiceFacade } from '../../shared/services/staking/staking-pool-service-facade';
import { StakingPoolFacade } from '../../shared/services/pool/staking-pool-facade';

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
      filter(() => Boolean(this.stakingPoolFacade.isPoolDefined())),
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
            switchMap((address) => this.stakingPoolFacade.getStake(address)
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
      withLatestFrom(
        this.store.select(stakeSelectors.isStakingDisabled)
      ),
      filter(([, isStakeDisabled]) => {
        if (isStakeDisabled) {
          this.toastr.error('You can not stake to this provider because you already staked to it!');
        }
        return !isStakeDisabled;
      }),
      tap(() => this.loadingService.show('Putting your stake')),
      switchMap(([{amount}]) => {

          return this.stakingPoolFacade.putStake(parseEther(amount))
            .pipe(
              map(() => {
                this.dialog.open(StakeSuccessComponent, {
                  width: '400px',
                  maxWidth: '100%',
                  disableClose: true,
                  backdropClass: 'backdrop-shadow'
                });
                return StakeActions.getStake();
              }),
              catchError(err => {
                console.error(err);
                this.toastr.error(err.message);
                return of(StakeActions.putStakeFailure({err: err.message}));
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
        this.stakingPoolFacade.withdrawalDelay()
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
        this.stakingPoolFacade.requestWithdraw()
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
        this.stakingPoolFacade.withdraw().pipe(
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
        this.stakingPoolFacade.checkReward().pipe(
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
            map((balance) => formatEther(balance)),
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


  getAllServices = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StakeActions.getAllServices),
        tap(() => this.loadingService.show('Loading list of providers')),
        switchMap(() => this.stakingService.allServices()
          .pipe(
            map((services) => StakeActions.getAllServicesSuccess({services}))
          )
        )
      ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<StakeState>,
              private iamService: IamService,
              private loadingService: LoadingService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private stakingService: StakingPoolServiceFacade,
              private stakingPoolFacade: StakingPoolFacade) {
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
