import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { PoolState } from './pool.reducer';
import * as PoolActions from './pool.actions';
import { catchError, filter, finalize, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { BigNumber, utils } from 'ethers';
import { Stake, StakeStatus } from 'iam-client-lib';
import { StakeSuccessComponent } from '../../routes/ewt-patron/stake-success/stake-success.component';
import * as poolSelectors from './pool.selectors';
import { ToastrService } from 'ngx-toastr';
import { IOrganizationDefinition } from '@energyweb/iam-contracts';
import { StakingPoolServiceFacade } from '../../shared/services/staking/staking-pool-service-facade';
import { StakingPoolFacade } from '../../shared/services/pool/staking-pool-facade';
import { WithdrawComponent } from '../../routes/ewt-patron/withdraw/withdraw.component';
import { NotEnroledRoleInfoComponent } from '../../routes/ewt-patron/not-enroled-role-info/not-enroled-role-info.component';

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

  setFinishDateOfStakingPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.stakingPoolFinishDate),
      switchMap(() => this.stakingPoolFacade.getEndDate()
        .pipe(
          map((d) => d.toNumber()),
          map((date) => PoolActions.stakingPoolFinishDateSuccess({date}))
        )
      )
    ));

  setStartDateOfStakingPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.stakingPoolStartDate),
      switchMap(() => this.stakingPoolFacade.getStartDate()
        .pipe(
          map((d) => d.toNumber()),
          map((date: number) => PoolActions.stakingPoolStartDateSuccess({date}))
        )
      )
    ));

  stakeIsInStakingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getStakeSuccess),
      map(({stake}) => stake.status),
      filter((status: StakeStatus) => status === StakeStatus.STAKING),
      mergeMap(() => [
        PoolActions.getAccountBalance(),
        PoolActions.checkReward(),
        PoolActions.totalStaked()
      ])
    )
  );

  stakeIsInNonStakingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getStakeSuccess),
      map(({stake}) => stake.status),
      filter((status: StakeStatus) => status === StakeStatus.NONSTAKING),
      map(() => PoolActions.getAccountBalance())
    )
  );

  getStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getStake),
      switchMap(() =>
        this.stakingPoolFacade.getStake()
          .pipe(
            filter<Stake>(Boolean),
            map((stake) => PoolActions.getStakeSuccess({stake}))
          )
      )
    )
  );

  putStake$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.putStake),
      tap(() => this.loadingService.show('Staking your EWT')),
      switchMap(({amount}) => {
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

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.withdrawReward),
      tap(() => this.loadingService.show('Withdrawing your reward...')),
      switchMap(({value}) =>
        this.stakingPoolFacade.partialWithdraw(parseEther(value.toString())).pipe(
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

  withdrawAllReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.withdrawAllReward),
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
          map((reward) => PoolActions.checkRewardSuccess({reward})),
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

  showProgressBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.openWithdrawDialog),
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

  getOrganizationDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getOrganizationDetails),
      tap(() => this.loadingService.show('Getting Organization details')),
      withLatestFrom(this.store.select(poolSelectors.getOrganization)),
      switchMap(([, organization]) => from(this.iamService.getDefinition(organization)).pipe(
          map((definition: IOrganizationDefinition) => PoolActions.getOrganizationDetailsSuccess({orgDetails: definition})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.getOrganizationDetailsFailure({err: err.message}));
          }),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  getOrganizationLimit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getHardCap),
      switchMap(() => this.stakingPoolFacade.getHardCap().pipe(
          map((cap: BigNumber) => PoolActions.getHardCapSuccess({cap})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.getHardCapFailure({err: err?.message}));
          })
        )
      )
    )
  );

  getTotalStaked = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.totalStaked),
      switchMap(() => this.stakingPoolFacade.getTotalStaked().pipe(
          map((cap: BigNumber) => PoolActions.totalStakedSuccess({cap})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.totalStakedFailure({err: err?.message}));
          })
        )
      )
    )
  );

  getRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getRoles),
      switchMap(() => from(this.iamService.claimsService.getClaimsByRequester({
          did: this.iamService.signerService.did,
          isAccepted: true
        })).pipe(
          map((roles) => roles.filter((item) => item.claimType === 'email.roles.verification.apps.energyweb.iam.ewc')),
          filter(roles => roles.length === 0),
          map(() => {
            this.dialog.open(NotEnroledRoleInfoComponent, {
              width: '400px',
              maxWidth: '100%',
              disableClose: true,
            });
          })
        )
      )
    ), {dispatch: false}
  );

  getContributorLimit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoolActions.getContributorLimit),
      switchMap(() => this.stakingPoolFacade.getContributionLimit().pipe(
          map((cap: BigNumber) => PoolActions.getContributorLimitSuccess({cap})),
          catchError(err => {
            console.error(err);
            return of(PoolActions.getContributorLimitFailure({err: err?.message}));
          })
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
          return [PoolActions.getStake(), PoolActions.getOrganizationDetails(), PoolActions.getHardCap(), PoolActions.getContributorLimit(), PoolActions.stakingPoolFinishDate(),
            PoolActions.stakingPoolStartDate(), PoolActions.totalStaked(), PoolActions.getRoles()];
        })
      );
  }
}
