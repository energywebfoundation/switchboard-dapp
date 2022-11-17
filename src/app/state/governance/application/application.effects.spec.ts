import { TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApplicationEffects } from './application.effects';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, iamServiceSpy, toastrSpy } from '@tests';
import { TestScheduler } from 'rxjs/testing';
import { IamService } from '../../../shared/services/iam.service';
import * as ApplicationActions from './application.actions';
import { IApp } from 'iam-client-lib';
import { EnvService } from '../../../shared/services/env/env.service';

describe('ApplicationEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: ApplicationEffects;
  let scheduler;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationEffects,
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: IamService, useValue: iamServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: EnvService, useValue: { rootNamespace: 'iam.ewc' } },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    effects = TestBed.inject(ApplicationEffects);
    iamServiceSpy.wrapWithLoadingService.and.callFake((source) => source);
  }));

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
  });

  it('should dispatch success action after successful getting list', () => {
    scheduler.run(({ cold, hot, expectObservable }) => {
      actions$ = hot('-a', { a: ApplicationActions.getList });
      iamServiceSpy.getENSTypesByOwner.and.returnValue(
        cold('--a|', { a: [{ namespace: 'test', name: 'app' }] })
      );

      expectObservable(effects.getList$).toBe('---c', {
        c: ApplicationActions.getListSuccess({
          list: [
            {
              namespace: 'test',
              name: 'app',
              organization: 'test',
              application: 'app',
              containsRoles: false,
            },
          ] as any as IApp[],
          namespace: 'iam.ewc',
        }),
      });
    });
  });

  it('should set containsRoles to true when element have any roles', () => {
    scheduler.run(({ cold, hot, expectObservable }) => {
      actions$ = hot('-a', { a: ApplicationActions.getList });
      iamServiceSpy.getENSTypesByOwner.and.returnValue(
        cold('--a|', { a: [{ namespace: 'test', roles: [{}] }] })
      );

      expectObservable(effects.getList$).toBe('---c', {
        c: ApplicationActions.getListSuccess({
          list: [
            {
              namespace: 'test',
              roles: [{}],
              containsRoles: true,
              organization: 'test',
              application: '',
            },
          ] as any as IApp[],
          namespace: 'iam.ewc',
        }),
      });
    });
  });

  it('should dispatch failure action after getting an error', (done) => {
    actions$.next(ApplicationActions.getList);
    iamServiceSpy.getENSTypesByOwner.and.returnValue(
      throwError({ message: 'message' })
    );

    effects.getList$.subscribe((resultAction) => {
      expect(toastrSpy.error).toHaveBeenCalled();
      expect(resultAction).toEqual(
        ApplicationActions.getListFailure({ error: 'message' })
      );
      done();
    });
  });
});
