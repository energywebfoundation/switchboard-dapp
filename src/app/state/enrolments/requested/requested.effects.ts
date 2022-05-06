import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { extendEnrolmentClaim } from '../pipes/extend-enrolment-claim';

@Injectable()
export class EnrolmentRequestsEffects {
  getEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.getEnrolmentRequests),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByIssuer()).pipe(
          extendEnrolmentClaim,
          map((enrolments) =>
            RequestedActions.getEnrolmentRequestsSuccess({ enrolments })
          ),
          catchError((e) => {
            console.error(e);
            return of(
              RequestedActions.getEnrolmentRequestsFailure({ error: e.message })
            );
          })
        )
      )
    )
  );

  updateEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.updateEnrolmentRequests),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByIssuer()).pipe(
          extendEnrolmentClaim,
          map((enrolments) =>
            RequestedActions.updateEnrolmentRequestsSuccess({ enrolments })
          ),
          catchError((e) => {
            console.error(e);
            return of(
              RequestedActions.updateEnrolmentRequestsFailure({
                error: e.message,
              })
            );
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private claimsFacade: ClaimsFacadeService
  ) {}
}
