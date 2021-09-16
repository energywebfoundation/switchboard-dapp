import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as  LayoutActions from './layout.actions';
import * as  LayoutSelectors from './layout.selectors';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class LayoutEffects {

  redirectToReturnUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LayoutActions.redirect),
      concatLatestFrom(() => this.store.select(LayoutSelectors.getRedirectUrl)
      ),
      filter(([, redirectUrl]) => redirectUrl !== ''),
      map(([, redirectUrl]) => {
        this.router.navigateByUrl(`${redirectUrl}`);
        return LayoutActions.redirectSuccess();
      })
    )
  );

  constructor(private actions$: Actions,
              private store: Store,
              private router: Router) {
  }
}
