import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';

@Injectable()
export class EnrolmentRequestsEffects extends EffectBaseAbstract {
  getEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.getEnrolmentRequests),
      this.getEnrolments(
        RequestedActions.getEnrolmentRequestsSuccess,
        RequestedActions.getEnrolmentRequestsFailure
      )
    )
  );

  updateEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.updateEnrolmentRequests),
      this.getEnrolments(
        RequestedActions.updateEnrolmentRequestsSuccess,
        RequestedActions.updateEnrolmentRequestsFailure
      )
    )
  );

  updateEnrolment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.updateEnrolment),
      this.updateEnrolment(
        RequestedActions.updateEnrolmentSuccess,
        RequestedActions.updateEnrolmentFailure
      )
    )
  );

  protected getClaims(): Observable<EnrolmentClaim[]> {
    return this.claimsFacade.getClaimsByIssuer();
  }

  protected getClaim(enrolment: EnrolmentClaim): Observable<EnrolmentClaim> {
    return this.claimsFacade.getClaimByIssuer(enrolment);
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private claimsFacade: ClaimsFacadeService,
    loadingService: LoadingService
  ) {
    super(loadingService);
  }
}
