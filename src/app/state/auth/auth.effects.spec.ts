import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthState } from './auth.reducer';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { ProviderType } from 'iam-client-lib';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { LoginService } from '../../shared/services/login/login.service';
import { Router } from '@angular/router';
import { ConnectToWalletDialogComponent } from '../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import * as AuthSelectors from './auth.selectors';
import { EnvService } from '../../shared/services/env/env.service';
import { RouterConst } from '../../routes/router-const';
import { ChainId } from '../../core/config/chain-id';

describe('AuthEffects', () => {
  let loginServiceSpy;
  let envServiceSpy;
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigateByUrl',
    'navigate',
  ]);
  let actions$: ReplaySubject<any>;
  let effects: AuthEffects;
  let store: MockStore<AuthState>;

  beforeEach(() => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', [
      'reinitialize',
      'login',
      'disconnect',
      'isSessionActive',
      'getProviderType',
      'getSession',
      'isMetamaskProvider',
      'wrongNetwork',
    ]);
    envServiceSpy = jasmine.createSpyObj('EnvService', [], {
      chainId: ChainId.Volta,
    });
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: EnvService, useValue: envServiceSpy },
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

    xit('should return action for setting metamask options ', (done) => {
      // TODO: find a way to spy on function. Or create an object for handling this.
      actions$.next(AuthActions.init());
      jasmine.createSpy('isMetamaskExtensionPresent').and.returnValue(
        Promise.resolve({
          isMetamaskPresent: true,
          chainId: 123,
        })
      );

      effects.metamaskOptions$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AuthActions.setMetamaskLoginOptions({ present: true, chainId: 123 })
        );
        done();
      });
    });
  });
  describe('checkNetwork$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should call wrong network method when metamask is present, chainId is different and will try to reauth with metamask', () => {
      loginServiceSpy.isMetamaskProvider.and.returnValue(true);
      actions$.next(
        AuthActions.setMetamaskLoginOptions({ present: true, chainId: 123 })
      );

      effects.checkNetwork$.subscribe();

      expect(loginServiceSpy.wrongNetwork).toHaveBeenCalled();
    });

    it('should not call wrongNetwork when metamask is not present', () => {
      loginServiceSpy.isMetamaskProvider.and.returnValue(true);
      actions$.next(
        AuthActions.setMetamaskLoginOptions({
          present: false,
          chainId: undefined,
        })
      );

      effects.checkNetwork$.subscribe();

      expect(loginServiceSpy.wrongNetwork).not.toHaveBeenCalled();
    });

    it('should not call wrongNetwork when metamask is present and chainId is correct', () => {
      loginServiceSpy.isMetamaskProvider.and.returnValue(true);
      actions$.next(
        AuthActions.setMetamaskLoginOptions({
          present: true,
          chainId: ChainId.Volta,
        })
      );

      effects.checkNetwork$.subscribe();

      expect(loginServiceSpy.wrongNetwork).not.toHaveBeenCalled();
    });

    it('should not call wrongNetwork when chainId is wrong but it will not reinitialize with metamask', () => {
      loginServiceSpy.isMetamaskProvider.and.returnValue(false);
      actions$.next(
        AuthActions.setMetamaskLoginOptions({ present: true, chainId: 123 })
      );

      effects.checkNetwork$.subscribe();

      expect(loginServiceSpy.wrongNetwork).not.toHaveBeenCalled();
    });
  });

  describe('loginViaDialog$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should close dialog and return login success action when login was successful', (done) => {
      actions$.next(
        AuthActions.loginViaDialog({ provider: ProviderType.MetaMask })
      );
      loginServiceSpy.login.and.returnValue(of({ success: true }));

      effects.loginViaDialog$.subscribe((resultAction) => {
        expect(loginServiceSpy.login).toHaveBeenCalledWith(
          {
            providerType: ProviderType.MetaMask,
            reinitializeMetamask: true,
          },
          undefined
        );
        expect(resultAction).toEqual(AuthActions.loginSuccess());
        expect(dialogSpy.closeAll).toHaveBeenCalled();

        done();
      });
    });

    it('should do not close dialog and return login failure action on login failure', (done) => {
      actions$.next(
        AuthActions.loginViaDialog({ provider: ProviderType.MetaMask })
      );
      loginServiceSpy.login.and.returnValue(of(false));

      effects.loginViaDialog$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginFailure());

        done();
      });
    });

    it('should do not close dialog and return login failure action when login throws error', (done) => {
      actions$.next(
        AuthActions.loginViaDialog({ provider: ProviderType.MetaMask })
      );
      loginServiceSpy.login.and.returnValue(throwError(''));

      effects.loginViaDialog$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginFailure());

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

      expect(dialogSpy.open).toHaveBeenCalledWith(
        ConnectToWalletDialogComponent,
        jasmine.objectContaining({
          width: '434px',
          panelClass: 'connect-to-wallet',
          backdropClass: 'backdrop-hide-content',
          data: {
            navigateOnTimeout: false,
          },
          maxWidth: '100%',
          disableClose: true,
        })
      );
    });
  });

  describe('welcomePageLogin$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should successfully login', (done) => {
      actions$.next(
        AuthActions.welcomeLogin({
          provider: ProviderType.MetaMask,
          returnUrl: '',
        })
      );
      loginServiceSpy.login.and.returnValue(of({ success: true }));

      effects.welcomePageLogin$
        .pipe(
          finalize(() => {
            expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
              '/' + RouterConst.Dashboard,
              jasmine.objectContaining({})
            );
          })
        )
        .subscribe((resultAction) => {
          expect(loginServiceSpy.login).toHaveBeenCalledWith({
            providerType: ProviderType.MetaMask,
            reinitializeMetamask: true,
          });
          expect(resultAction).toEqual(AuthActions.loginSuccess());
          done();
        });
    });

    it('should navigate to a url that is sent in action', (done) => {
      actions$.next(
        AuthActions.welcomeLogin({
          provider: ProviderType.MetaMask,
          returnUrl: 'returnUrl',
        })
      );
      loginServiceSpy.login.and.returnValue(of({ success: true }));

      effects.welcomePageLogin$.subscribe((resultAction) => {
        expect(loginServiceSpy.login).toHaveBeenCalledWith({
          providerType: ProviderType.MetaMask,
          reinitializeMetamask: true,
        });
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          `/${RouterConst.ReturnUrl}`
        );
        expect(resultAction).toEqual(AuthActions.loginSuccess());
        done();
      });
    });

    it('should return failure action when login fails', (done) => {
      actions$.next(
        AuthActions.welcomeLogin({
          provider: ProviderType.MetaMask,
          returnUrl: '',
        })
      );
      loginServiceSpy.login.and.returnValue(of(false));

      effects.welcomePageLogin$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginFailure());
        done();
      });
    });
  });

  describe('reinitializeUser$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should reinitialize with Wallet Connect', (done) => {
      actions$.next(
        AuthActions.setMetamaskLoginOptions({ present: true, chainId: 1 })
      );

      loginServiceSpy.isSessionActive.and.returnValue(true);
      store.overrideSelector(AuthSelectors.isUserLoggedIn, false);
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.WalletConnect,
        publicKey: 'key',
      });

      effects.reinitializeUser$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AuthActions.reinitializeAuthWithoutMetamask()
        );
        done();
      });
    });

    it('should reinitialize with metamask', (done) => {
      actions$.next(
        AuthActions.setMetamaskLoginOptions({ present: true, chainId: 1 })
      );

      loginServiceSpy.isSessionActive.and.returnValue(true);
      store.overrideSelector(AuthSelectors.isUserLoggedIn, false);
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.MetaMask,
        publicKey: 'key',
      });

      effects.reinitializeUser$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AuthActions.reinitializeAuthWithMetamask()
        );
        done();
      });
    });
  });

  describe('reinitializeLoggedUserWithMetamask$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return failure action when reinitialization fails', (done) => {
      actions$.next(AuthActions.reinitializeAuthWithMetamask());

      store.overrideSelector(AuthSelectors.isMetamaskDisabled, false);
      loginServiceSpy.reinitialize.and.returnValue(of(false));
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.MetaMask,
        publicKey: 'key',
      });

      effects.reinitializeLoggedUserWithMetamask$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginFailure());
        done();
      });
    });

    it('should return success action when reinitialization completes successfully', (done) => {
      actions$.next(AuthActions.reinitializeAuthWithMetamask());
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.MetaMask,
        publicKey: 'key',
      });
      store.overrideSelector(AuthSelectors.isMetamaskDisabled, false);
      loginServiceSpy.reinitialize.and.returnValue(of({ success: true }));

      effects.reinitializeLoggedUserWithMetamask$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginSuccess());
        done();
      });
    });

    it('should not call login method when it is using metamask but with wrong chain id (metamask is disabled)', (done) => {
      actions$.next(AuthActions.reinitializeAuthWithMetamask());

      loginServiceSpy.isSessionActive.and.returnValue(true);

      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.MetaMask,
        publicKey: 'key',
      });

      store.overrideSelector(AuthSelectors.isMetamaskDisabled, true);

      effects.reinitializeLoggedUserWithMetamask$.subscribe();
      expect(loginServiceSpy.reinitialize).not.toHaveBeenCalled();
      done();
    });
  });

  describe('reinitializeLoggedUser$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return failure action when reinitialization fails', (done) => {
      actions$.next(AuthActions.reinitializeAuthWithoutMetamask());
      loginServiceSpy.reinitialize.and.returnValue(of(false));
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.WalletConnect,
        publicKey: 'key',
      });

      effects.reinitializeLoggedUser$.subscribe((resultAction) => {
        expect(resultAction).toEqual(AuthActions.loginFailure());
        done();
      });
    });

    it('should return success action when reinitialization completes successfully', (done) => {
      actions$.next(AuthActions.reinitializeAuthWithoutMetamask());
      loginServiceSpy.getSession.and.returnValue({
        providerType: ProviderType.WalletConnect,
        publicKey: 'key',
      });
      loginServiceSpy.reinitialize.and.returnValue(of({ success: true }));

      effects.reinitializeLoggedUser$.subscribe((resultAction) => {
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
      loginServiceSpy.getProviderType.and.returnValue(
        ProviderType.WalletConnect
      );

      effects.setWalletProviderAfterLogin$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          AuthActions.setProvider({
            walletProvider: ProviderType.WalletConnect,
          })
        );
        done();
      });
    });
  });

  describe('notPossibleToReinitializeUser$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should navigate to welcome page when session is not active', (done) => {
      loginServiceSpy.isSessionActive.and.returnValue(false);
      actions$.next(AuthActions.reinitializeAuthWithoutMetamask());
      effects.notPossibleToReinitializeUser$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith([RouterConst.Welcome]);
        done();
      });
    });
  });

  describe('navigateToDashboardWhenSessionIsActive$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should navigate to dashboard page when session is active', (done) => {
      loginServiceSpy.isSessionActive.and.returnValue(true);
      actions$.next(AuthActions.navigateWhenSessionActive());
      effects.navigateToDashboardWhenSessionIsActive$.subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith([
          RouterConst.Dashboard,
        ]);
        done();
      });
    });
  });
});
