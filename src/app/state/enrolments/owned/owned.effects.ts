import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, from, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { extendEnrolmentClaim } from '../pipes/extend-enrolment-claim';

@Injectable()
export class OwnedEnrolmentsEffects {
  getOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getOwnedEnrolments),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByRequester()).pipe(
          extendEnrolmentClaim,
          switchMap(enrolments => from(this.claimsFacade.appendDidDocSyncStatus(enrolments))),
          map((enrolments: EnrolmentClaim[]) =>
            OwnedActions.getOwnedEnrolmentsSuccess({ enrolments })
          ),
          catchError((e) => {
            console.error(e);
            return of(
              OwnedActions.getOwnedEnrolmentsFailure({ error: e.message })
            );
          })
        )
      )
    )
  );

  updateOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.updateOwnedEnrolments),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByRequester()).pipe(
          this.checkForNotSyncedOnChain,
          extendEnrolmentClaim,
          switchMap(enrolments => from(this.claimsFacade.appendDidDocSyncStatus(enrolments))),
          map((enrolments: EnrolmentClaim[]) =>
            OwnedActions.updateOwnedEnrolmentsSuccess({ enrolments })
          ),
          catchError((e) => {
            console.error(e);
            return of(
              OwnedActions.updateOwnedEnrolmentsFailure({ error: e.message })
            );
          })
        )
      )
    )
  );

  checkForNotSyncedOnChain(source) {
    return source.pipe(
      switchMap((enrolments: EnrolmentClaim[]) => {
        return forkJoin(
          enrolments.map((enrolment) =>
            from(this.claimsFacade.checkForNotSyncedOnChain(enrolment))
          )
        );
      })
    );
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private claimsFacade: ClaimsFacadeService,
  ) {
  }
}
