import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { IamService } from '../../shared/services/iam.service';
import { catchError, finalize, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { mapClaimsProfile } from '../../routes/assets/operators/map-claims-profile';
import { Profile } from 'iam-client-lib';
import { LoadingService } from '../../shared/services/loading.service';
import { CancelButton } from '../../layout/loading/loading.component';
import { Store } from '@ngrx/store';
import * as UserSelectors from './user.selectors';

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

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserClaims),
      tap(() => this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED)),
      withLatestFrom(this.store.select(UserSelectors.getUserProfile)),
      map(([{ profile }, oldProfile]) => ({...oldProfile, ...profile})),
      switchMap((profile: Profile) => from(this.iamService.iam.createSelfSignedClaim({
          data: {
            profile
          }
        }))
          .pipe(
            map(() => UserActions.updateUserClaimsSuccess({profile})),
            catchError(err => of(UserActions.updateUserClaimsFailure({ error: err }))),
            finalize(() => this.loadingService.hide())
          )
      ),
      finalize(() => this.loadingService.hide())
    ));

  constructor(private actions$: Actions,
              private store: Store,
              private iamService: IamService,
              private loadingService: LoadingService) {
  }
}
