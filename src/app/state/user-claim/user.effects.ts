import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { IamService } from '../../shared/services/iam.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { mapClaimsProfile } from '../../routes/assets/operators/map-claims-profile';
import { Profile } from 'iam-client-lib';

@Injectable()
export class UserEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserClaims),
      switchMap(() =>
        from(this.iamService.iam.getUserClaims())
          .pipe(
            map(data => UserActions.loadUserClaimsSuccess({ userClaims: data })),
            catchError(err => of(UserActions.loadUserClaimsFailure({ error: err })))
          )
      )
    )
  );

  getUserProfile = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserClaimsSuccess),
      map(userClaimsAction => userClaimsAction.userClaims),
      mapClaimsProfile(),
      map((profile: Profile) => UserActions.setProfile({ profile }))
    )
  );

  constructor(private actions$: Actions,
              private iamService: IamService) {
  }
}
