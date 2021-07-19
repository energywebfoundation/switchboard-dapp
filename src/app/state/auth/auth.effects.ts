import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { catchError, concatMap, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { IAM } from 'iam-client-lib';
import { from, of } from 'rxjs';
import { PatronLoginService } from '../../routes/ewt-patron/patron-login.service';
import * as StakeActions from '../../state/stake/stake.actions';
import * as authSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {

  metamaskLogIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      switchMap(() =>
        from(IAM.isMetamaskExtensionPresent())
          .pipe(
            map(({isMetamaskPresent, chainId}) =>
              AuthActions.setMetamaskLoginOptions({
                present: !!isMetamaskPresent,
                chainId
              })
            )
          )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginHeaderStakingButton),
      switchMap(() =>
        this.patronLoginService.login().pipe(
          mergeMap(() => [AuthActions.loginSuccess(), StakeActions.initStakingPool()]),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure());
          })
        )
      )
    )
  );

  loginBeforeStake = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginAndStake),
      withLatestFrom(this.store.select(authSelectors.isUserLoggedIn)),
      filter(([, loggedIn]) => !loggedIn),
      switchMap(([{amount}]) =>
        this.patronLoginService.login().pipe(
          concatMap(() => [AuthActions.loginSuccess(), StakeActions.initStakingPool(), StakeActions.putStake({amount})]),
          catchError((err) => {
            console.log(err);
            return of(AuthActions.loginFailure());
          })
        )
      )
    )
  );

  stakeWhenLoggedIn = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginAndStake),
      withLatestFrom(this.store.select(authSelectors.isUserLoggedIn)),
      filter(([{amount}, loggedIn]) => loggedIn),
      map(([{amount}]) => StakeActions.putStake({amount})),
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.iamService.disconnect())
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private store: Store<AuthState>,
              private iamService: IamService,
              private patronLoginService: PatronLoginService) {
  }

}
