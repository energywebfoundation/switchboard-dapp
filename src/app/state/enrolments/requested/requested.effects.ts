import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RequestedActions from './requested.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

@Injectable()
export class EnrolmentRequestsEffects {
  getEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.getEnrolmentRequests),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        this.claimsFacade.getClaimsByIssuer().pipe(
          this.getEnrolments(
            RequestedActions.getEnrolmentRequestsSuccess,
            RequestedActions.getEnrolmentRequestsFailure
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  updateEnrolmentRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestedActions.updateEnrolmentRequests),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByIssuer()).pipe(
          this.getEnrolments(
            RequestedActions.updateEnrolmentRequestsSuccess,
            RequestedActions.updateEnrolmentRequestsFailure
          )
        )
      )
    )
  );

  private getEnrolments(successAction, failureAction) {
    return (source: Observable<EnrolmentClaim[]>) => {
      return source.pipe(
        map((enrolments) => successAction({ enrolments })),
        catchError((e) => {
          console.error(e);
          return of(
            failureAction({
              error: e.message,
            })
          );
        })
      );
    };
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private claimsFacade: ClaimsFacadeService,
    private loadingService: LoadingService
  ) {}
}
