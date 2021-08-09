import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { PoolState } from './pool.reducer';
import * as PoolActions from './pool.actions';
import { catchError, delay, filter, finalize, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { utils } from 'ethers';
import { Stake, StakeStatus } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import * as poolSelectors from './pool.selectors';
import { ToastrService } from 'ngx-toastr';
import { WithdrawComponent } from '../../routes/ewt-patron/withdraw/withdraw.component';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';
import { StakingPoolServiceFacade } from '../../shared/services/staking/staking-pool-service-facade';
import { StakingPoolFacade } from '../../shared/services/pool/staking-pool-facade';

const {formatEther, parseEther} = utils;

@Injectable()
export class PoolEffects {
  initPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.initPool),
      withLatestFrom(this.store.select(poolSelectors.getOrganization)),
      filter(([, org]) => Boolean(org)),
      switchMap(([, organization]) =>
        this.createPool(organization)
      )
    )
  );

  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.setOrganization),
      filter(() => Boolean(this.stakingPoolFacade.isPoolDefined())),
      switchMap(({organization}) =>
        this.createPool(organization)
      )
    )
  );

  getStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getStake),
      switchMap(() =>
        from(this.iamService.getAddress())
          .pipe(
            switchMap((address) => this.stakingPoolFacade.getStake(address)
              .pipe(
                filter<Stake>(Boolean),
                mergeMap((stake) => {
                    const actions = [PoolActions.getStakeSuccess({stake}), PoolActions.getAccountBalance()];
                    if (stake.status === StakeStatus.STAKING) {
                      return [...actions, PoolActions.checkReward()];
                    }
                    if (stake.status === StakeStatus.WITHDRAWING) {
                      return [
                        ...actions,
                        PoolActions.checkReward(),
                        PoolActions.withdrawRewardSuccess(),
                        PoolActions.displayConfirmationDialog()
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
      ofType(PoolActions.putStake),
      withLatestFrom(
        this.store.select(poolSelectors.isStakingDisabled)
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
                return PoolActions.getStake();
              }),
              catchError(err => {
                console.error(err);
                this.toastr.error(err.message);
                return of(PoolActions.putStakeFailure({err: err.message}));
              }),
              finalize(() => this.loadingService.hide())
            );
        }
      )
    )
  );

  withdrawalDelay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getWithdrawalDelay),
      switchMap(() =>
        this.stakingPoolFacade.withdrawalDelay()
          .pipe(
            map(withdrawalDelay => () => delay(withdrawalDelay as any)),
            map(() => PoolActions.withdrawalDelayExpired()
            ),
            catchError(err => {
              console.error('Could not get withdrawal delay', err);
              return of(PoolActions.getWithdrawalDelayFailure({err}));
            }),
          )
      )
    )
  );

  showProgressBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.withdrawRequest, PoolActions.displayConfirmationDialog),
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
      ofType(PoolActions.withdrawRequest),
      switchMap(() =>
        this.stakingPoolFacade.requestWithdraw()
          .pipe(
            map(() => {
              return PoolActions.getWithdrawalDelay();
            }),
            catchError((err) => {
              console.error(err);
              this.toastr.error('Error occurs while trying to request a withdraw.');
              this.dialog.closeAll();
              return of(PoolActions.withdrawRequestFailure({err}));
            }),
          )
      )
    )
  );

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.withdrawReward),
      tap(() => this.loadingService.show('Withdrawing your reward...')),
      switchMap(() =>
        this.stakingPoolFacade.withdraw().pipe(
          mergeMap(() => {
            this.dialog.closeAll();
            return [PoolActions.withdrawRewardSuccess(), PoolActions.getStake()];
          }),
          catchError(err => {
            console.error(err);
            return of(PoolActions.withdrawRewardFailure({err}));
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
      ofType(PoolActions.checkReward),
      switchMap(() =>
        this.stakingPoolFacade.checkReward().pipe(
          map((reward) => PoolActions.checkRewardSuccess({reward: formatEther(reward as any)})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.checkRewardFailure(err));
          })
        )
      )
    )
  );

  getAccountBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getAccountBalance),
      switchMap(() =>
        from(this.iamService.getBalance())
          .pipe(
            map((balance) => formatEther(balance)),
            map(balance => PoolActions.getAccountSuccess({balance}))
          )
      )
    )
  );

  getOrganizationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getOrganizationDetails),
      tap(() => this.loadingService.show('Getting Organization details')),
      withLatestFrom(this.store.select(poolSelectors.getOrganization)),
      switchMap(([, organization]) => from(this.iamService.getDefinition(organization)).pipe(
          map((definition: IOrganizationDefinition) => PoolActions.getOrganizationDetailsSuccess({orgDetails: definition})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.getOrganizationDetailsFailure({err}));
          }),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  constructor(private actions$: Actions,
              private store: Store<PoolState>,
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
            return [PoolActions.getOrganizationDetails()];
          }
          return [PoolActions.getStake(), PoolActions.getOrganizationDetails()];
        })
      );
  }
}
