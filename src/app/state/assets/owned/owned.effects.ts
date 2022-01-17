/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AssetsFacadeService } from '../../../shared/services/assets-facade/assets-facade.service';

@Injectable()
export class OwnedEffects {
  getOwnedAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getOwnedAssets),
      switchMap(() =>
        this.assetFacade.getOwnedAssets().pipe(
          map((assets) =>
            assets.map((item: any) => {
              return {
                ...item,
                createdDate: new Date(item.createdAt),
                modifiedDate: new Date(item.updatedAt),
              };
            })
          ),
          map((assets) => OwnedActions.getOwnedAssetsSuccess({ assets })),
          catchError((e) => {
            console.error(e);
            return of(OwnedActions.getOwnedAssetsFailure({ error: e.message }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private assetFacade: AssetsFacadeService
  ) {}
}
