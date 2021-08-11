import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { IAM, WalletProvider } from 'iam-client-lib';
import { from, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../shared/services/login/login.service';

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

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.loginService.disconnect();
        location.reload();
      })
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private loginService: LoginService,
              private dialog: MatDialog) {
  }

}
