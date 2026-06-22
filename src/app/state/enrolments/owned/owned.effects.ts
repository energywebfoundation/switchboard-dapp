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
import { from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';
import { loadEnrolmentPage, loadLastEnrolmentPage } from '../utils/pagination';

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
        return from(
          loadEnrolmentPage(
            (pageSkip, pageTake) =>
              this.claimsFacade.getClaimsByRequesterPaginated(
                pageSkip,
                pageTake
              ),
            skip,
            take
          )
        ).pipe(
          map((page) =>
            OwnedActions.getOwnedEnrolmentsSuccess({
              enrolments: page.enrolments,
              skip: page.skip,
              take: page.take,
              hasNextPage: page.hasNextPage,
            })
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

  getLastOwnedEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OwnedActions.getLastOwnedEnrolments),
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
        return from(
          loadLastEnrolmentPage(
            (pageSkip, pageTake) =>
              this.claimsFacade.getClaimsByRequesterPaginated(
                pageSkip,
                pageTake
              ),
            skip,
            take
          )
        ).pipe(
          map((page) =>
            OwnedActions.getOwnedEnrolmentsSuccess({
              enrolments: page.enrolments,
              skip: page.skip,
              take: page.take,
              hasNextPage: page.hasNextPage,
            })
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
        return from(
          loadEnrolmentPage(
            (pageSkip, pageTake) =>
              this.claimsFacade.getClaimsByRequesterPaginated(
                pageSkip,
                pageTake
              ),
            skip,
            take
          )
        ).pipe(
          map((page) =>
            OwnedActions.updateOwnedEnrolmentsSuccess({
              enrolments: page.enrolments,
              hasNextPage: page.hasNextPage,
            })
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
