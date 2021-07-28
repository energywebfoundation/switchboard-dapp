import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { catchError, finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { IAM } from 'iam-client-lib';
import { from, of } from 'rxjs';
import * as StakeActions from '../../state/stake/stake.actions';

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
      tap(({provider}) => this.iamService.waitForSignature(provider, true, false)),
      switchMap(({provider}) =>
        from(this.iamService.login({walletProvider: provider})).pipe(
          mergeMap((loggedIn) => {
            if (loggedIn) {
              return [AuthActions.loginSuccess(), StakeActions.initStakingPool()];
            }
            return [AuthActions.loginFailure()];
          }),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure());
          }),
          finalize(() => this.iamService.clearWaitSignatureTimer())
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        this.iamService.disconnect();
        location.reload();
      })
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private iamService: IamService) {
  }

}
