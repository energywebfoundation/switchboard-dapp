import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as userActions from './user.actions';
import * as userClaimsActions from './user.actions';
import { IamService } from '../../shared/services/iam.service';
import { catchError, finalize, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { mapClaimsProfile } from '../../routes/assets/operators/map-claims-profile';
import { Profile } from 'iam-client-lib';
import { LoadingService } from '../../shared/services/loading.service';
import { CancelButton } from '../../layout/loading/loading.component';
import { Store } from '@ngrx/store';
import * as userSelectors from './user.selectors';
import { MatDialog } from '@angular/material/dialog';
import { UserClaimState } from './user.reducer';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class UserEffects {
  loadUserClaims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserClaims),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        from(this.iamService.iam.getUserClaims())
          .pipe(
            map(data => userActions.loadUserClaimsSuccess({userClaims: data})),
            catchError(err => of(userActions.loadUserClaimsFailure({error: err}))),
            finalize(() => this.loadingService.hide())
          )
      )
    )
  );

  getUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.loadUserClaimsSuccess),
      map(userClaimsAction => userClaimsAction.userClaims),
      mapClaimsProfile(),
      map((profile: Profile) => userActions.setProfile({profile}))
    )
  );

  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updateUserClaims),
      tap(() => this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED)),
      withLatestFrom(this.store.select(userSelectors.getUserProfile)),
      map(([{profile}, oldProfile]) => this.mergeProfiles(oldProfile, profile)),
      switchMap((profile: Profile) => from(this.iamService.iam.createSelfSignedClaim({
          data: {
            profile
          }
        }))
          .pipe(
            map(() => {
              this.toastr.success('Identity is updated.', 'Success');
              return userActions.updateUserClaimsSuccess({profile});
            }),
            catchError(err => {
              this.toastr.error(err.message, 'System Error');
              console.error('Saving Identity Error', err);
              return of(userActions.updateUserClaimsFailure({error: err}));
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
      ofType(userActions.setUpUser),
      tap(() => this.loadingService.show()),
      switchMap(() => this.iamService.getDidDocument()
        .pipe(
          mergeMap((didDocument) => [
            userClaimsActions.setDidDocument({didDocument}),
            userClaimsActions.loadUserClaims()
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
