import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { catchError, filter, finalize, map, switchMap, tap } from 'rxjs/operators';
import { IAM, WalletProvider } from 'iam-client-lib';
import { from, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../shared/services/login/login.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';

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

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(({provider, navigateOnTimeout}) => this.loginService.waitForSignature(provider, true, navigateOnTimeout)),
      switchMap(({provider, navigateOnTimeout}) =>
        from(this.loginService.login({
          walletProvider: provider,
          reinitializeMetamask: provider === WalletProvider.MetaMask
        }, navigateOnTimeout)).pipe(
          map((loggedIn) => {
            if (loggedIn) {
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

  userSuccessfullyLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() => {
        return from(this.loginService.setupUser())
      })
    ), {dispatch: false}
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.loginService.disconnect();
        location.reload();
      })
    ), {dispatch: false}
  );

  reinitializeLoggedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.reinitializeAuth),
      tap(() => this.loadingService.show()),
      filter(() => this.loginService.isSessionActive()),
      switchMap(() => {
        console.log('reinitializing');
        return from(this.loginService.login())
          .pipe(
            map(() => AuthActions.loginSuccess()),
            finalize(() => this.loadingService.hide())
            );
      })
    )
  );

  notPossibleToReinitializeUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.reinitializeAuth),
      filter(() => !this.loginService.isSessionActive()),
      map(({redirectUrl}) => {
        console.log('not possible, should redirect');
        this.router.navigateByUrl(redirectUrl);
      })
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private loginService: LoginService,
              private loadingService: LoadingService,
              private dialog: MatDialog,
              private router: Router) {
  }

}
