import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthState } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { IAM, WalletProvider } from 'iam-client-lib';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../shared/services/login/login.service';
import { Router } from '@angular/router';
import { ConnectToWalletDialogComponent } from '../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import * as AuthSelectors from './auth.selectors';

describe('AuthEffects', () => {

  const loginServiceSpy = jasmine.createSpyObj('LoginService', ['waitForSignature', 'clearWaitSignatureTimer', 'login', 'disconnect', 'isSessionActive', 'walletProvider']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  let actions$: ReplaySubject<any>;
  let effects: AuthEffects;
  let store: MockStore<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {provide: LoginService, useValue: loginServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        {provide: Router, useValue: routerSpy},
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

  describe('loginViaDialog$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should close dialog and return login success action when login was successful', (done) => {
      actions$.next(AuthActions.loginViaDialog({provider: WalletProvider.MetaMask}));
      loginServiceSpy.login.and.returnValue(of({success: true}));

      effects.loginViaDialog$.pipe(
        finalize(() => expect(loginServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled())
      )
        .subscribe(resultAction => {
          expect(loginServiceSpy.login).toHaveBeenCalledWith({
            walletProvider: WalletProvider.MetaMask,
            reinitializeMetamask: true
          }, undefined);
          expect(loginServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(resultAction).toEqual(AuthActions.loginSuccess());
          expect(dialogSpy.closeAll).toHaveBeenCalled();

          done();
        });
    });

    it('should do not close dialog and return login failure action on login failure', (done) => {
      actions$.next(AuthActions.loginViaDialog({provider: WalletProvider.MetaMask}));
      loginServiceSpy.login.and.returnValue(of(false));

      effects.loginViaDialog$.pipe(
        finalize(() => expect(loginServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled())
      )
        .subscribe(resultAction => {
          expect(loginServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(resultAction).toEqual(AuthActions.loginFailure());

          done();
        });
    });

    it('should do not close dialog and return login failure action when login throws error', (done) => {
      actions$.next(AuthActions.loginViaDialog({provider: WalletProvider.MetaMask}));
      loginServiceSpy.login.and.returnValue(throwError(''));

      effects.loginViaDialog$
        .subscribe(resultAction => {
          expect(resultAction).toEqual(AuthActions.loginFailure());

          done();
        });
    });

    it('should call waitForSignature with metamask and not navigate on timeout option', (done) => {
      actions$.next(AuthActions.loginViaDialog({provider: WalletProvider.MetaMask, navigateOnTimeout: false}));
      loginServiceSpy.login.and.returnValue(of({success: true}));

      effects.loginViaDialog$
        .subscribe(() => {
          expect(loginServiceSpy.waitForSignature).toHaveBeenCalledWith(WalletProvider.MetaMask, true, false);
          done();
        });
    });

  });

  describe('openLoginDialog$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should open dialog when calling openLoginDialog action', () => {
      actions$.next(AuthActions.openLoginDialog());

      effects.openLoginDialog$.subscribe();

      expect(dialogSpy.open).toHaveBeenCalledWith(ConnectToWalletDialogComponent, jasmine.objectContaining({
        width: '434px',
        panelClass: 'connect-to-wallet',
        backdropClass: 'backdrop-hide-content',
        data: {
          navigateOnTimeout: false
        },
        maxWidth: '100%',
        disableClose: true
      }));
    });
  });

  describe('welcomePageLogin$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should successfully login', (done) => {
      actions$.next(AuthActions.welcomeLogin({provider: WalletProvider.MetaMask, returnUrl: ''}));
      loginServiceSpy.login.and.returnValue(of({success: true}));

      effects.welcomePageLogin$
        .pipe(
          finalize(() => {
            expect(loginServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled();
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard', jasmine.objectContaining({}));
          })
        )
        .subscribe(resultAction => {
          expect(loginServiceSpy.login).toHaveBeenCalledWith({
            walletProvider: WalletProvider.MetaMask,
            reinitializeMetamask: true
          });
          expect(loginServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(resultAction).toEqual(AuthActions.loginSuccess());
          done();
        });
    });

    it('should navigate to a url that is sent in action', (done) => {
      actions$.next(AuthActions.welcomeLogin({provider: WalletProvider.MetaMask, returnUrl: 'returnUrl'}));
      loginServiceSpy.login.and.returnValue(of({success: true}));

      effects.welcomePageLogin$
        .pipe(
          finalize(() => {
            expect(loginServiceSpy.clearWaitSignatureTimer).toHaveBeenCalled();
          })
        )
        .subscribe(resultAction => {
          expect(loginServiceSpy.login).toHaveBeenCalledWith({
            walletProvider: WalletProvider.MetaMask,
            reinitializeMetamask: true
          });
          expect(loginServiceSpy.waitForSignature).toHaveBeenCalled();
          expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/returnUrl');
          expect(resultAction).toEqual(AuthActions.loginSuccess());
          done();
        });
    });

    it('should return failure action when login fails', (done) => {
      actions$.next(AuthActions.welcomeLogin({provider: WalletProvider.MetaMask, returnUrl: ''}));
      loginServiceSpy.login.and.returnValue(of(false));

      effects.welcomePageLogin$
        .subscribe(resultAction => {
          expect(resultAction).toEqual(AuthActions.loginFailure());
          done();
        });
    });
  });

  describe('reinitializeLoggedUser$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return failure action when reinitialization fails', (done) => {
      actions$.next(AuthActions.reinitializeAuth());
      loginServiceSpy.isSessionActive.and.returnValue(true);
      store.overrideSelector(AuthSelectors.isUserLoggedIn, false);
      loginServiceSpy.login.and.returnValue(of(false));

      effects.reinitializeLoggedUser$.subscribe(resultAction => {
        expect(resultAction).toEqual(AuthActions.loginFailure());
        done();
      });
    });

    it('should return success action when reinitialization completes successfully', (done) => {
      actions$.next(AuthActions.reinitializeAuth());
      loginServiceSpy.isSessionActive.and.returnValue(true);
      store.overrideSelector(AuthSelectors.isUserLoggedIn, false);
      loginServiceSpy.login.and.returnValue(of({success: true}));

      effects.reinitializeLoggedUser$.subscribe(resultAction => {
        expect(resultAction).toEqual(AuthActions.loginSuccess());
        done();
      });
    });
  });

  describe('setWalletProviderAfterLogin$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return dispatch action for setting wallet provider', (done) => {
      actions$.next(AuthActions.loginSuccess());
      loginServiceSpy.walletProvider.and.returnValue(WalletProvider.WalletConnect);

      effects.setWalletProviderAfterLogin$.subscribe(resultAction => {
        expect(resultAction).toEqual(AuthActions.setProvider({walletProvider: WalletProvider.WalletConnect}));
        done();
      });
    });
  });


});
