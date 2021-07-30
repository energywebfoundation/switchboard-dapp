import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { IamService } from '../../shared/services/iam.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthState } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { IAM, WalletProvider } from 'iam-client-lib';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

describe('AuthEffects', () => {

  const iamServiceSpy = jasmine.createSpyObj('IamService', ['waitForSignature', 'clearWaitSignatureTimer', 'login', 'disconnect']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  let actions$: ReplaySubject<any>;
  let effects: AuthEffects;
  let store: MockStore<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {provide: IamService, useValue: iamServiceSpy},
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
      spyOn(IAM, 'isMetamaskExtensionPresent').and.returnValue(Promise.resolve({
        isMetamaskPresent: true,
        chainId: 123
      }));

      effects.metamaskOptions$.subscribe(resultAction => {
        expect(resultAction).toEqual(AuthActions.setMetamaskLoginOptions({present: true, chainId: 123}));
        done();
      });
    });
  });

  describe('login$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should close dialog and return login success action when login was successful', (done) => {
      actions$.next(AuthActions.login({provider: WalletProvider.MetaMask}));
      iamServiceSpy.login.and.returnValue(Promise.resolve(true));

      effects.login$.pipe(
        finalize(() => expect(iamServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled())
      )
        .subscribe(resultAction => {
          expect(iamServiceSpy.login).toHaveBeenCalledWith({
            walletProvider: WalletProvider.MetaMask,
            reinitializeMetamask: true
          }, undefined);
          expect(iamServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(resultAction).toEqual(AuthActions.loginSuccess());
          expect(dialogSpy.closeAll).toHaveBeenCalled();

          done();
        });
    });

    it('should do not close dialog and return login failure action on login failure', (done) => {
      actions$.next(AuthActions.login({provider: WalletProvider.MetaMask}));
      iamServiceSpy.login.and.returnValue(Promise.resolve(false));

      effects.login$.pipe(
        finalize(() => expect(iamServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled())
      )
        .subscribe(resultAction => {
          expect(iamServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(resultAction).toEqual(AuthActions.loginFailure());

          done();
        });
    });

    it('should do not close dialog and return login failure action when login throws error', (done) => {
      actions$.next(AuthActions.login({provider: WalletProvider.MetaMask}));
      iamServiceSpy.login.and.returnValue(Promise.reject());

      effects.login$
        .subscribe(resultAction => {
          expect(resultAction).toEqual(AuthActions.loginFailure());

          done();
        });
    });

    it('should call waitForSignature with metamask and not navigate on timeout option', (done) => {
      actions$.next(AuthActions.login({provider: WalletProvider.MetaMask, navigateOnTimeout: false}));
      iamServiceSpy.login.and.returnValue(Promise.resolve(true));

      effects.login$
        .subscribe(() => {
          expect(iamServiceSpy.waitForSignature).toHaveBeenCalledWith(WalletProvider.MetaMask, true, false);
          done();
        });
    });

  });
});
