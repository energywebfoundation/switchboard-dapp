import { TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ApplicationEffects } from './application.effects';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, iamServiceSpy, toastrSpy } from '@tests';
import { TestScheduler } from 'rxjs/testing';
import { IamService } from '../../../shared/services/iam.service';
import * as ApplicationActions from './application.actions';
import { IApp } from 'iam-client-lib';

describe('ApplicationEffects', () => {

  let actions$: ReplaySubject<any>;
  let effects: ApplicationEffects;
  let store: MockStore;
  let scheduler;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationEffects,
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: IamService, useValue: iamServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    scheduler = new TestScheduler(((actual, expected) => {
      expect(actual).toEqual(expected);
    }));
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(ApplicationEffects);
    iamServiceSpy.wrapWithLoadingService.and.callFake((source) => source);
  }));

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
  });

  it('should dispatch success action after successful getting list', () => {
    scheduler.run(({cold, hot, expectObservable}) => {
      actions$ = hot('-a', {a: ApplicationActions.getList});
      iamServiceSpy.getENSTypesByOwner.and.returnValue(cold('--a|', {a: [{namespace: 'test'}]}));

      expectObservable(effects.getList$).toBe('---c', {
        c: ApplicationActions.getListSuccess({list: [{namespace: 'test'}] as any as IApp[]})

      });
    });
  });

  it('should dispatch failure action after getting an error', (done) => {
    actions$.next(ApplicationActions.getList);
    iamServiceSpy.getENSTypesByOwner.and.returnValue(throwError({message: 'message'}));

    effects.getList$.subscribe(resultAction => {
        expect(toastrSpy.error).toHaveBeenCalled();
        expect(resultAction).toEqual(ApplicationActions.getListFailure({error: 'message'}));
        done();
      }
    );
  });

});
