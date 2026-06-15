import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RevokableActions from './revokable.actions';
import * as RevokableSelectors from './revokable.selectors';
import { Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';
import { Store } from '@ngrx/store';
import {
  catchError,
  finalize,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Injectable()
export class RevokableEnrolmentEffects extends EffectBaseAbstract {
  getRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.getRevocableEnrolments),
      switchMap(({ skip, take }) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByRevoker(skip, take).pipe(
          map((enrolments) =>
            RevokableActions.getRevocableEnrolmentsSuccess({
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
              RevokableActions.getRevocableEnrolmentsFailure({
                error: e.message,
              })
            );
          }),
          finalize(() => hide())
        );
      })
    )
  );

  updateRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.updateRevocableEnrolments),
      withLatestFrom(this.store.select(RevokableSelectors.getPagination)),
      switchMap(([_, { skip, take }]) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByRevoker(skip, take).pipe(
          map((enrolments) =>
            RevokableActions.updateRevocableEnrolmentsSuccess({ enrolments })
          ),
          tap(() => hide()),
          catchError((e) => {
            console.error(e);
            hide();
            return of(
              RevokableActions.updateRevocableEnrolmentsFailure({
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

  protected getClaim(id: string): Observable<EnrolmentClaim> {
    return this.claimsFacade.getClaimByRevoker(id);
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
