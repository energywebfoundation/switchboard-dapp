import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { IamService } from '../../shared/services/iam.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthState } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { IAM } from 'iam-client-lib';
import { MatDialog } from '@angular/material/dialog';

describe('AuthEffects', () => {

  const iamSpy = jasmine.createSpyObj('iam', ['login', 'disconnect', 'clearWaitSignatureTimer', 'waitForSignature']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  let actions$: ReplaySubject<any>;
  let effects: AuthEffects;
  let store: MockStore<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: MatDialog, useValue: dialogSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(AuthEffects);
  });

  describe('metamaskOptions$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return action for setting metamask options ', (done) => {
      actions$.next(AuthActions.init());
      spyOn(IAM, 'isMetamaskExtensionPresent').and.returnValue(Promise.resolve({isMetamaskPresent: true, chainId: 123}));

      effects.metamaskOptions$.subscribe(resultAction => {
        expect(resultAction).toEqual(AuthActions.setMetamaskLoginOptions({present: true, chainId: 123}));
        done();
      });
    });
  });
});
