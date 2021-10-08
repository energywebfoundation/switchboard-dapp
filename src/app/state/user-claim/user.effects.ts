import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IamService } from '../../shared/services/iam.service';
import { catchError, finalize, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { mapClaimsProfile } from '@operators';
import { Profile } from 'iam-client-lib';
import { LoadingService } from '../../shared/services/loading.service';
import { CancelButton } from '../../layout/loading/loading.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { UserClaimState } from './user.reducer';
import { ToastrService } from 'ngx-toastr';
import * as UserClaimActions from './user.actions';
import * as UserClaimSelectors from './user.selectors';

@Injectable()
export class UserEffects {
  loadUserClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserClaimActions.loadUserClaims),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        from(this.iamService.getUserClaims())
          .pipe(
            map(data => UserClaimActions.loadUserClaimsSuccess({userClaims: data})),
            catchError(err => of(UserClaimActions.loadUserClaimsFailure({error: err}))),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  getUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserClaimActions.loadUserClaimsSuccess),
      map(userClaimsAction => userClaimsAction.userClaims),
      mapClaimsProfile(),
      map((profile: Profile) => UserClaimActions.setProfile({profile}))
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserClaimActions.updateUserClaims),
      tap(() => this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED)),
      withLatestFrom(this.store.select(UserClaimSelectors.getUserProfile)),
      map(([{profile}, oldProfile]) => this.mergeProfiles(oldProfile, profile)),
      switchMap((profile: Profile) => from(this.iamService.createSelfSignedClaim({
          data: {
            profile
          }
        }))
          .pipe(
            map(() => {
              this.toastr.success('Identity is updated.', 'Success');
              return UserClaimActions.updateUserClaimsSuccess({profile});
            }),
            catchError(err => {
              this.toastr.error(err.message, 'System Error');
              console.error('Saving Identity Error', err);
              return of(UserClaimActions.updateUserClaimsFailure({error: err}));
            }),
            finalize(() => {
              this.loadingService.hide();
              this.dialog.closeAll();
            })
          )
      )
    ));

  setUpUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserClaimActions.setUpUser),
      tap(() => this.loadingService.show()),
      switchMap(() => this.iamService.getDidDocument()
        .pipe(
          mergeMap((didDocument) => [
            UserClaimActions.setDidDocument({didDocument}),
            UserClaimActions.loadUserClaims()
          ]),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  private mergeProfiles(oldProfile: Partial<Profile>, newProfile: Partial<Profile>): Partial<Profile> {
    return {
      ...oldProfile,
      ...newProfile,
      assetProfiles: {
        ...(oldProfile?.assetProfiles),
        ...(newProfile?.assetProfiles)
      }
    };
  }

  constructor(private actions$: Actions,
              private store: Store<UserClaimState>,
              private iamService: IamService,
              private loadingService: LoadingService,
              private toastr: ToastrService,
              private dialog: MatDialog) {
  }
}
