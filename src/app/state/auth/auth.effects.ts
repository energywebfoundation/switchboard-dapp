import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import {
  catchError,
  delay,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { isMetamaskExtensionPresent, ProviderType } from 'iam-client-lib';
import { from, of, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../shared/services/login/login.service';
import { Router } from '@angular/router';
import * as userActions from '../user-claim/user.actions';
import { ConnectToWalletDialogComponent } from '../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import * as AuthSelectors from './auth.selectors';
import { EnvService } from '../../shared/services/env/env.service';
import { RouterConst } from '../../routes/router-const';
import { OwnedEnrolmentsActions, RequestedEnrolmentsActions } from '@state';

@Injectable()
export class AuthEffects {
  metamaskOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      switchMap(() =>
        from(isMetamaskExtensionPresent()).pipe(
          map(({ isMetamaskPresent, chainId }) =>
            AuthActions.setMetamaskLoginOptions({
              present: isMetamaskPresent,
              chainId: chainId ? parseInt(`${chainId}`, 16) : undefined,
            })
          )
        )
      )
    )
  );

  defaultChainId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      map(() =>
        AuthActions.setDefaultChainId({
          defaultChainId: this.envService.chainId,
        })
      )
    )
  );

  checkNetwork$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setMetamaskLoginOptions),
        map(({ present, chainId }) => {
          if (!present) {
            return;
          }
          if (chainId === this.envService.chainId) {
            return;
          }
          if (!this.loginService.isMetamaskProvider()) {
            return;
          }
          this.loginService.wrongNetwork();
        })
      ),
    { dispatch: false }
  );

  loginViaDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginViaDialog),
      switchMap(({ provider, navigateOnTimeout }) =>
        this.loginService
          .login(
            {
              providerType: provider,
              reinitializeMetamask: provider === ProviderType.MetaMask,
            },
            navigateOnTimeout
          )
          .pipe(
            map(({ success, accountInfo }) => {
              if (success) {
                this.dialog.closeAll();
                return AuthActions.loginSuccess({ accountInfo });
              }
              return AuthActions.loginFailure();
            }),
            catchError((err) => {
              console.log(err);
              return of(AuthActions.loginFailure());
            })
          )
      )
    )
  );

  openLoginDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.openLoginDialog),
        map(() => {
          this.dialog.open(ConnectToWalletDialogComponent, {
            width: '434px',
            panelClass: 'connect-to-wallet',
            backdropClass: 'backdrop-hide-content',
            data: {
              navigateOnTimeout: false,
            },
            maxWidth: '100%',
            disableClose: true,
          });
        })
      ),
    { dispatch: false }
  );

  welcomePageLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.welcomeLogin),
      switchMap(({ provider, returnUrl }) =>
        this.loginService
          .login({
            providerType: provider,
            reinitializeMetamask: provider === ProviderType.MetaMask,
          })
          .pipe(
            map(({ success, accountInfo }) => {
              if (success) {
                this.router.navigateByUrl(`/${returnUrl}`);
                return AuthActions.loginSuccess({ accountInfo });
              }
              return AuthActions.loginFailure();
            }),
            catchError((err) => {
              console.log(err);
              return of(AuthActions.loginFailure());
            })
          )
      )
    )
  );

  userSuccessfullyLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      mergeMap(() => [
        userActions.setUpUser(),
        OwnedEnrolmentsActions.getOwnedEnrolments(),
        RequestedEnrolmentsActions.getEnrolmentRequests(),
      ])
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => this.loginService.disconnect())
      ),
    { dispatch: false }
  );

  logoutWithRedirectUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutWithRedirectUrl),
        map(() => this.loginService.logout(true))
      ),
    { dispatch: false }
  );

  reinitializeLoggedUserWithMetamask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.reinitializeAuth,
        AuthActions.reinitializeAuthForEnrol
      ),
      // delay added because there is race condition between reinitializing user and getting info from metamask.
      // When Metamask didn't give any info to the store, reinitialization doesn't work. Most of the time reinitialization is first.
      // Automatic user reinitialization can't be done after MM info, because we have 2 different ways to initialize.
      // One is with page redirect, second is with staying on visited page.
      // Possible refactoring: depend on routing.
      delay(100),
      filter(this.loginService.isSessionActive),
      this.isMetamaskDisabled(),
      this.isLoggedIn(),
      switchMap(() =>
        this.loginService
          .login({ providerType: this.loginService.getSession().providerType })
          .pipe(
            map(({ success, accountInfo }) => {
              if (success) {
                return AuthActions.loginSuccess({ accountInfo });
              }
              return AuthActions.loginFailure();
            }),
            catchError((err) => {
              console.log(err);
              return of(AuthActions.loginFailure());
            })
          )
      )
    )
  );

  reinitializeLoggedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.reinitializeAuth,
        AuthActions.reinitializeAuthForEnrol
      ),
      filter(this.loginService.isSessionActive),
      this.isProviderDifferentThanMetamask(),
      this.isLoggedIn(),
      switchMap(() =>
        this.loginService
          .login({ providerType: this.loginService.getSession().providerType })
          .pipe(
            map(({ success, accountInfo }) => {
              if (success) {
                return AuthActions.loginSuccess({ accountInfo });
              }
              return AuthActions.loginFailure();
            }),
            catchError((err) => {
              console.log(err);
              return of(AuthActions.loginFailure());
            })
          )
      )
    )
  );

  notPossibleToReinitializeUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.reinitializeAuth),
        filter(() => !this.loginService.isSessionActive()),
        map(() => {
          this.router.navigate([RouterConst.Welcome]);
        })
      ),
    { dispatch: false }
  );

  setWalletProviderAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() =>
        AuthActions.setProvider({
          walletProvider: this.loginService.getProviderType(),
        })
      )
    )
  );

  navigateToDashboardWhenSessionIsActive$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.navigateWhenSessionActive),
        filter(() => this.loginService.isSessionActive()),
        map(() => this.router.navigate([RouterConst.Dashboard]))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private loginService: LoginService,
    private dialog: MatDialog,
    private router: Router,
    private envService: EnvService
  ) {}

  private isMetamaskDisabled() {
    return (source) => {
      return source.pipe(
        filter(
          () =>
            this.loginService.getSession().providerType ===
            ProviderType.MetaMask
        ),
        concatLatestFrom(() =>
          this.store.select(AuthSelectors.isMetamaskDisabled)
        ),
        filter(([, isMetamaskDisabled]) => !isMetamaskDisabled)
      );
    };
  }

  private isLoggedIn() {
    return (source) => {
      return source.pipe(
        concatLatestFrom(() => this.store.select(AuthSelectors.isUserLoggedIn)),
        filter(([, isLoggedIn]) => !isLoggedIn)
      );
    };
  }

  private isProviderDifferentThanMetamask() {
    return (source) =>
      source.pipe(
        filter(
          () =>
            this.loginService.getSession().providerType !==
            ProviderType.MetaMask
        )
      );
  }
}
