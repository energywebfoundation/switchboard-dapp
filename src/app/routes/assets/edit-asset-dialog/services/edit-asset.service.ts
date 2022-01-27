import { Injectable } from '@angular/core';
import { Profile } from 'iam-client-lib';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { UserClaimActions, UserClaimSelectors } from '@state';
import { Store } from '@ngrx/store';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';

@Injectable({
  providedIn: 'root',
})
export class EditAssetService {
  constructor(
    private claimFacade: ClaimsFacadeService,
    private store: Store,
    private toastr: SwitchboardToastrService
  ) {}

  getProfile(): Observable<Profile> {
    return this.store.select(UserClaimSelectors.getUserProfile).pipe(take(1));
  }

  update(profile: Profile) {
    return this.claimFacade
      .createSelfSignedClaim({
        data: { profile },
      })
      .pipe(
        map(() => {
          this.store.dispatch(
            UserClaimActions.updateLocalStateUserClaims({ profile: profile })
          );
          this.toastr.success('Successfully updated Asset data');
          return true;
        }),
        catchError((error) => {
          console.error(error);
          this.toastr.error(error?.message);
          return of(false);
        })
      );
  }
}
