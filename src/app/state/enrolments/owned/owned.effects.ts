import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as OwnedActions from './owned.actions';
import * as OwnedSelectors from './owned.selectors';
import {
  catchError,
  finalize,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';

@Injectable()
export class OwnedEnrolmentsEffects extends EffectBaseAbstract {
  getOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getOwnedEnrolments),
      switchMap(({ skip, take }) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByRequesterPaginated(skip, take).pipe(
          map((enrolments) =>
            OwnedActions.getOwnedEnrolmentsSuccess({ enrolments, skip, take })
          ),
          tap(() => hide()),
          catchError((e) => {
            console.error(e);
            hide();
            return of(
              OwnedActions.getOwnedEnrolmentsFailure({ error: e.message })
            );
          }),
          finalize(() => hide())
        );
      })
    )
  );

  updateOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.updateOwnedEnrolments),
      withLatestFrom(this.store.select(OwnedSelectors.getPagination)),
      switchMap(([_, { skip, take }]) => {
        this.loadingService.show();
        let hidden = false;
        const hide = () => {
          if (!hidden) {
            this.loadingService.hide();
            hidden = true;
          }
        };
        return this.claimsFacade.getClaimsByRequesterPaginated(skip, take).pipe(
          map((enrolments) =>
            OwnedActions.updateOwnedEnrolmentsSuccess({ enrolments })
          ),
          tap(() => hide()),
          catchError((e) => {
            console.error(e);
            hide();
            return of(
              OwnedActions.updateOwnedEnrolmentsFailure({ error: e.message })
            );
          }),
          finalize(() => hide())
        );
      })
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
