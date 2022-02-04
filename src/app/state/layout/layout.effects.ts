import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as LayoutActions from './layout.actions';
import * as LayoutSelectors from './layout.selectors';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as AuthSelectors from '../auth/auth.selectors';

@Injectable()
export class LayoutEffects {
  redirectToReturnUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.redirect),
      concatLatestFrom(() => this.store.select(LayoutSelectors.getRedirectUrl)),
      filter(([, redirectUrl]) => redirectUrl !== ''),
      map(([, redirectUrl]) => {
        this.router.navigateByUrl(`${redirectUrl}`);
        return LayoutActions.redirectSuccess();
      })
    )
  );

  redirectWhenUrlIsSetAndLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.setRedirectUrl),
      concatLatestFrom(() => this.store.select(AuthSelectors.isUserLoggedIn)),
      filter(([, isLoggedIn]) => isLoggedIn),
      map(([{ url }]) => {
        this.router.navigateByUrl(`${url}`);
        return LayoutActions.redirectSuccess();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router
  ) {}
}
