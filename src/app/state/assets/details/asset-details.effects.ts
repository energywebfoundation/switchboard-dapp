import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IamService } from '../../../shared/services/iam.service';
import * as AssetDetailsActions from './asset-details.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AssetDetailsEffects {
  getAssetDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetDetailsActions.getDetails),
      switchMap(({ assetId }) =>
        this.iamService.getAssetById(assetId).pipe(
          map((asset) => AssetDetailsActions.getDetailsSuccess({ asset })),
          catchError((e) => {
            console.error(e);
            return of(
              AssetDetailsActions.getDetailsFailure({ error: e.message })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private iamService: IamService
  ) {}
}
