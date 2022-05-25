import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { extendEnrolmentClaim } from '../pipes/extend-enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable()
export class OwnedEnrolmentsEffects {
  getOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getOwnedEnrolments),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByRequester()).pipe(
          this.getEnrolments(
            OwnedActions.getOwnedEnrolmentsSuccess,
            OwnedActions.getOwnedEnrolmentsFailure
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

  updateOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.updateOwnedEnrolments),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByRequester()).pipe(
          this.getEnrolments(
            OwnedActions.updateOwnedEnrolmentsSuccess,
            OwnedActions.updateOwnedEnrolmentsFailure
          )
        )
      )
    )
  );

  private getEnrolments(successAction, failureAction) {
    return (source: Observable<EnrolmentClaim[]>) => {
      return source.pipe(
        switchMap((enrolments) =>
          from(this.claimsFacade.appendDidDocSyncStatus(enrolments))
        ),
        extendEnrolmentClaim(),
        switchMap((enrolments: EnrolmentClaim[]) => this.claimsFacade.setIsRevokedStatus(enrolments)),
        map((enrolments: EnrolmentClaim[]) => successAction({ enrolments })),
        catchError((e) => {
          console.error(e);
          return of(failureAction({ error: e.message }));
        })
      );
    };
  }

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
    private loadingService: LoadingService
  ) {}
}
