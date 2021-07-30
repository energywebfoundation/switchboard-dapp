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

describe('StakeEffects', () => {

  const iamServiceSpy = jasmine.createSpyObj('IamService', ['getDefinition', 'getBalance', 'getAddress']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  const stakingService = jasmine.createSpyObj('StakingService', ['init', 'createPool']);
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

});
