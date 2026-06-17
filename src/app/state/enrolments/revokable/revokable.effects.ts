import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RevokableActions from './revokable.actions';
import * as RevokableSelectors from './revokable.selectors';
import { from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { EffectBaseAbstract } from '../utils/effect.base.abstract';
import { Store } from '@ngrx/store';
import {
  loadEnrolmentPage,
  loadLastEnrolmentPageFromAll,
} from '../utils/pagination';
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
        return from(
          loadEnrolmentPage(
            (pageSkip, pageTake) =>
              this.claimsFacade.getClaimsByRevoker(pageSkip, pageTake),
            skip,
            take
          )
        ).pipe(
          map((page) =>
            RevokableActions.getRevocableEnrolmentsSuccess({
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

  getLastRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.getLastRevocableEnrolments),
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
        return from(
          loadLastEnrolmentPageFromAll(
            () => this.claimsFacade.getClaimsByRevoker(),
            take
          )
        ).pipe(
          map((page) =>
            RevokableActions.getRevocableEnrolmentsSuccess({
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
        return from(
          loadEnrolmentPage(
            (pageSkip, pageTake) =>
              this.claimsFacade.getClaimsByRevoker(pageSkip, pageTake),
            skip,
            take
          )
        ).pipe(
          map((page) =>
            RevokableActions.updateRevocableEnrolmentsSuccess({
              enrolments: page.enrolments,
              hasNextPage: page.hasNextPage,
            })
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
