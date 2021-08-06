import { TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { StakeEffects } from './stake.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { LoadingService } from '../../shared/services/loading.service';
import { IamService } from '../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { StakeState } from './stake.reducer';
import * as StakeActions from './stake.actions';
import { StakingService } from '../../shared/services/staking/staking.service';
import { skip, take } from 'rxjs/operators';
import * as stakeSelectors from './stake.selectors';
import { utils } from 'ethers';

const {formatEther, parseEther} = utils;
describe('StakeEffects', () => {

  const iamServiceSpy = jasmine.createSpyObj('IamService', ['getDefinition', 'getBalance', 'getAddress']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);
  const stakingService = jasmine.createSpyObj('StakingService', ['init', 'createPool', 'getPool', 'putStake']);
  let actions$: ReplaySubject<any>;
  let effects: StakeEffects;
  let store: MockStore<StakeState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StakeEffects,
        {provide: IamService, useValue: iamServiceSpy},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        {provide: ToastrService, useValue: toastrSpy},
        {provide: StakingService, useValue: stakingService},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(StakeEffects);
  });

  describe('initStakingPoolService$', () => {

    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return initPool action and getAccountBalance action', waitForAsync(() => {
      actions$.next(StakeActions.initStakingPool());
      stakingService.init.and.returnValue(Promise.resolve(true));

      effects.initStakingPoolService$.pipe(take(1)).subscribe(resultAction => {
        expect(resultAction).toEqual(StakeActions.initPool());
      });

      effects.initStakingPoolService$.pipe(skip(1)).subscribe(resultAction => {
        expect(resultAction).toEqual(StakeActions.getAccountBalance());
      });
    }));
  });

  describe('initPool$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should create a pool and call actions for getting stake and organization', waitForAsync(() => {
      stakingService.createPool.and.returnValue(Promise.resolve(true));
      store.overrideSelector(stakeSelectors.getOrganization, 'org');
      actions$.next(StakeActions.initPool());

      effects.initPool$.pipe(take(1)).subscribe(resultAction => {
        expect(resultAction).toEqual(StakeActions.getStake());
      });
      effects.initPool$.pipe(skip(1)).subscribe(resultAction => {
        expect(resultAction).toEqual(StakeActions.getOrganizationDetails());
      });
    }));

    it('should not create a pool when getting empty organization', waitForAsync(() => {
      stakingService.createPool.and.returnValue(Promise.resolve(true));
      store.overrideSelector(stakeSelectors.getOrganization, '');
      actions$.next(StakeActions.initPool());

      effects.initPool$.subscribe(resultAction => {
        expect(resultAction).toEqual(null);
      });
    }));

    it('should not create a pool when getting an organization which is not a provider', () => {
      stakingService.createPool.and.returnValue(Promise.resolve(false));
      store.overrideSelector(stakeSelectors.getOrganization, 'org');
      actions$.next(StakeActions.initPool());

      effects.initPool$.subscribe(resultAction => {
        expect(toastrSpy.error).toHaveBeenCalled();
        expect(resultAction).toEqual(StakeActions.getOrganizationDetails());
      });

    });
  });

  describe('putStake$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should put a stake and refresh data', () => {
      actions$.next(StakeActions.putStake({amount: '5'}));
      store.overrideSelector(stakeSelectors.isStakingDisabled, false);

      stakingService.putStake.and.returnValue(Promise.resolve());

      effects.putStake$.subscribe(resultAction => {
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(stakingService.putStake).toHaveBeenCalledWith(parseEther('5'));
        expect(resultAction).toEqual(StakeActions.getStake());
      });
    });

    it('should not put a stake when staking is disabled', waitForAsync(() => {
      actions$.next(StakeActions.putStake({amount: '5'}));
      store.overrideSelector(stakeSelectors.isStakingDisabled, true);

      stakingService.putStake.and.returnValue(Promise.resolve());

      effects.putStake$.subscribe(resultAction => {
        expect(resultAction).toEqual(null, 'This subscribe should not return an action');
      });

      expect(toastrSpy.error).toHaveBeenCalled();
    }));

    it('should return failure action when putStake throws an error', () => {
      actions$.next(StakeActions.putStake({amount: '5'}));
      store.overrideSelector(stakeSelectors.isStakingDisabled, false);

      stakingService.putStake.and.returnValue(Promise.reject({message: 'message'}));

      effects.putStake$.subscribe(resultAction => {
        expect(toastrSpy.error).toHaveBeenCalledWith('message');
        expect(resultAction).toEqual(StakeActions.putStakeFailure({err: 'message'}));
      });
    });
  });

});
