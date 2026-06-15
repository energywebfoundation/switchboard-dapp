import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import * as RequestedSelectors from './requested.selectors';
import { Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';
import {
  catchError,
  finalize,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Injectable()
export class EnrolmentRequestsEffects extends EffectBaseAbstract {
  getEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.getEnrolmentRequests),
      switchMap(({ skip, take }) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByIssuer(skip, take).pipe(
          map((enrolments) =>
            RequestedActions.getEnrolmentRequestsSuccess({
              enrolments,
              skip,
              take,
            })
          ),
          tap(() => hide()),
          catchError((e) => {
            console.error(e);
            hide();
            return of(
              RequestedActions.getEnrolmentRequestsFailure({
                error: e.message,
              })
            );
          }),
          finalize(() => hide())
        );
      })
    )
  );

  updateEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.updateEnrolmentRequests),
      withLatestFrom(this.store.select(RequestedSelectors.getPagination)),
      switchMap(([_, { skip, take }]) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByIssuer(skip, take).pipe(
          map((enrolments) =>
            RequestedActions.updateEnrolmentRequestsSuccess({ enrolments })
          ),
          tap(() => hide()),
          catchError((e) => {
            console.error(e);
            hide();
            return of(
              RequestedActions.updateEnrolmentRequestsFailure({
                error: e.message,
              })
            );
          }),
          finalize(() => hide())
        );
      })
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

  protected getClaim(enrolmentId: string): Observable<EnrolmentClaim> {
    return this.claimsFacade.getClaimByIssuer(enrolmentId);
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
