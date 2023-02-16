import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RevokableActions from './revokable.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';

@Injectable()
export class RevokableEnrolmentEffects extends EffectBaseAbstract {
  getRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.getRevocableEnrolments),
      this.getEnrolments(
        RevokableActions.getRevocableEnrolmentsSuccess,
        RevokableActions.getRevocableEnrolmentsFailure
      )
    )
  );

  updateRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.updateRevocableEnrolments),
      this.getEnrolments(
        RevokableActions.updateRevocableEnrolmentsSuccess,
        RevokableActions.updateRevocableEnrolmentsFailure
      )
    )
  );

  updateEnrolment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.updateEnrolment),
      this.updateEnrolment(
        RevokableActions.updateEnrolmentSuccess,
        RevokableActions.updateEnrolmentFailure
      )
    )
  );

  protected getClaims(): Observable<EnrolmentClaim[]> {
    return this.claimsFacade.getClaimsByRevoker();
  }

  protected getClaim(enrolment: EnrolmentClaim): Observable<EnrolmentClaim> {
    return this.claimsFacade.getClaimByRevoker(enrolment);
  }

  constructor(
    private actions$: Actions,
    private claimsFacade: ClaimsFacadeService,
    loadingService: LoadingService
  ) {
    super(loadingService);
  }
}
