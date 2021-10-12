import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { catchError, filter, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { IAM, WalletProvider } from 'iam-client-lib';
import { from, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../shared/services/login/login.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import * as userActions from '../user-claim/user.actions';
import { ConnectToWalletDialogComponent } from '../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import * as StakeActions from '../stake/stake.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {

  metamaskOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      switchMap(() =>
        from(IAM.isMetamaskExtensionPresent())
          .pipe(
            map(({isMetamaskPresent, chainId}) =>
              AuthActions.setMetamaskLoginOptions({
                present: isMetamaskPresent,
                chainId
              })
            )
          )
      )
    )
  );

  loginViaDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginViaDialog),
      tap(({provider, navigateOnTimeout}) => this.loginService.waitForSignature(provider, true, navigateOnTimeout)),
      switchMap(({provider, navigateOnTimeout}) =>
        this.loginService.login({
          walletProvider: provider,
          reinitializeMetamask: provider === WalletProvider.MetaMask
        }, navigateOnTimeout).pipe(
          map(({success}) => {
            if (success) {
              this.dialog.closeAll();
              return AuthActions.loginSuccess();
            }
            return AuthActions.loginFailure();
          }),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure());
          }),
          finalize(() => this.loginService.clearWaitSignatureTimer())
        )
      )
    )
  );

  openLoginDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.openLoginDialog),
      map(() => {
        this.dialog.open(ConnectToWalletDialogComponent, {
          width: '434px',
          panelClass: 'connect-to-wallet',
          backdropClass: 'backdrop-hide-content',
          data: {
            navigateOnTimeout: false
          },
          maxWidth: '100%',
          disableClose: true
        });
      })
    ), {dispatch: false}
  );

  welcomePageLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.welcomeLogin),
      tap(({provider}) => this.loginService.waitForSignature(provider, true)),
      switchMap(({provider, returnUrl}) =>
        this.loginService.login({
          walletProvider: provider,
          reinitializeMetamask: provider === WalletProvider.MetaMask
        }).pipe(
          map(({success}) => {
            if (success) {
              this.router.navigateByUrl(`/${returnUrl}`);
              return AuthActions.loginSuccess();
            }
            return AuthActions.loginFailure();
          }),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure());
          }),
          finalize(() => {
            this.loginService.clearWaitSignatureTimer();
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
        StakeActions.initStakingPool()
      ])
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.loginService.disconnect();
      })
    ), {dispatch: false}
  );

  logoutWithRedirectUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutWithRedirectUrl),
      map(() => {
        this.loginService.logout(true);
      })
    ), {dispatch: false}
  );

  reinitializeLoggedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.reinitializeAuth, AuthActions.reinitializeAuthForPatron, AuthActions.reinitializeAuthForEnrol),
      filter(() => this.loginService.isSessionActive()),
      concatLatestFrom(() => this.store.select(AuthSelectors.isUserLoggedIn)),
      filter(([, isLoggedIn]) => !isLoggedIn),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        this.loginService.login()
          .pipe(
            map(({success}) => {
              if (success) {
                return AuthActions.loginSuccess();
              }
              return AuthActions.loginFailure();
            }),
            catchError((err => {
              console.log(err);
              return of(AuthActions.loginFailure());
            })),
            finalize(() => {
              this.loadingService.hide();
            })
          )
      )
    )
  );

  notPossibleToReinitializeUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.reinitializeAuth),
      filter(() => !this.loginService.isSessionActive()),
      map(() => {
        this.router.navigate(['welcome']);
      })
    ), {dispatch: false}
  );

  setWalletProviderAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => AuthActions.setProvider({walletProvider: this.loginService.walletProvider()}))
    ));

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private loginService: LoginService,
              private loadingService: LoadingService,
              private dialog: MatDialog,
              private router: Router) {
  }

}
