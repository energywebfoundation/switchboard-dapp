import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { Observable } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';

@Injectable()
export class OwnedEnrolmentsEffects extends EffectBaseAbstract {
  getOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getOwnedEnrolments),
      this.getEnrolments(
        OwnedActions.getOwnedEnrolmentsSuccess,
        OwnedActions.getOwnedEnrolmentsFailure
      )
    )
  );

  updateOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.updateOwnedEnrolments),
      this.getEnrolments(
        OwnedActions.updateOwnedEnrolmentsSuccess,
        OwnedActions.updateOwnedEnrolmentsFailure
      )
    )
  );

  updateEnrolment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.updateEnrolment),
      this.updateEnrolment(
        OwnedActions.updateEnrolmentSuccess,
        OwnedActions.updateEnrolmentFailure
      )
    )
  );

  protected getClaim(id: string): Observable<EnrolmentClaim> {
    return this.claimsFacade.getClaimByRequester(id);
  }

  protected getClaims(): Observable<EnrolmentClaim[]> {
    return this.claimsFacade.getClaimsByRequester();
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
