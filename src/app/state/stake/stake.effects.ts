import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { StakingPool, StakingPoolService } from 'iam-client-lib';
import { LoadingService } from '../../shared/services/loading.service';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { StakeState } from './stake.reducer';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import * as StakeActions from './stake.actions';
import * as stakeSelectors from './stake.selectors';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { from } from 'rxjs';
import { utils } from 'ethers';

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
              return [StakeActions.initStakingPoolSuccess(), StakeActions.getAccountBalance(), StakeActions.checkReward()];
            })
          )
      )
    )
  );

  initPool$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.initStakingPoolSuccess),
      withLatestFrom(this.store.select(stakeSelectors.getOrganization)),
      switchMap(([, organization]) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            map((pool: StakingPool) => this.pool = pool)
          )
      )
    ), {dispatch: false}
  );

  setOrganization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.setOrganization),
      switchMap(({organization}) =>
        from(this.stakingPoolService.getPool(organization))
          .pipe(
            map((pool: StakingPool) => this.pool = pool)
          )
      )
    ), {dispatch: false}
  );

  putStake = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.putStake),
      switchMap(({amount}) =>
        from(this.pool.putStake(parseEther(amount)))
          .pipe(
            mergeMap(() => [StakeActions.getAccountBalance(), StakeActions.checkReward()])
          )
      )
    )
  );

  withdrawReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StakeActions.withdrawReward),
      switchMap(() =>
        from(this.pool.withdraw())
          .pipe(
            map(() => StakeActions.withdrawRewardSuccess())
          )
      )
    ));

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
              private loadingService: LoadingService,
              private toastr: SwitchboardToastrService,
              private dialog: MatDialog) {
  }

}
