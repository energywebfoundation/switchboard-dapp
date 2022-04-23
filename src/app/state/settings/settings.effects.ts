import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as SettingsActions from './settings.actions';
import { SettingsStorage } from './models/settings-storage';
import { UrlService } from '../../shared/services/url-service/url.service';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { RouterConst } from '../../routes/router-const';

@Injectable()
export class SettingsEffects {
  redirectFromAssetsToDashboard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.disableExperimental),
        switchMap(() =>
          this.urlService.current().pipe(
            take(1),
            filter((url) => url.includes(RouterConst.Assets)),
            tap(() => this.urlService.goTo(RouterConst.Dashboard))
          )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private urlService: UrlService
  ) {
    this.enableExperimental();
  }

  private enableExperimental() {
    if (SettingsStorage.isExperimentalEnabled()) {
      this.store.dispatch(SettingsActions.enableExperimental());
    }
  }
}
