import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RevokableActions from './revokable.actions';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, from, Observable, of } from 'rxjs';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { CredentialsFacadeService } from 'src/app/shared/services/verifiable-credentials-facade/verifiable-credential.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import { extendEnrolmentClaim } from '../pipes/extend-enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';

@Injectable()
export class RevokableEnrolmentEffects {
  getRevokableEnrolments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RevokableActions.getRevokableEnrolments),
      tap(() => this.loadingService.show()),
      switchMap(() =>
        from(this.claimsFacade.getClaimsByRevoker()).pipe(
          this.getRevokableEnrolments(
            RevokableActions.getRevokableEnrolmentsSuccess,
            RevokableActions.getRevokableEnrolmentsFailure
          ),
          finalize(() => this.loadingService.hide())
        )
      )
    )
  );

private getRevokableEnrolments(success, failure) {
  return (source: Observable<EnrolmentClaim[]>) => {
    return source.pipe(
      switchMap((enrolments) =>
        from(this.claimsFacade.appendDidDocSyncStatus(enrolments))
      ),
      switchMap((enrolments: EnrolmentClaim[]) =>
        this.claimsFacade.setIsRevokedStatus(enrolments)
      ),
      // switchMap((enrolments: EnrolmentClaim[]) =>
      //   from(this.credentialsFacade.setCredentialRevokedStatus(enrolments))
      // ),
      extendEnrolmentClaim(),
      map((enrolments: EnrolmentClaim[]) => success({ enrolments })),
      catchError((e) => {
        console.error(e);
        return of(failure({ error: e.message }));
      })
    );
  };

}


//   updateOwnedEnrolments$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(OwnedActions.updateOwnedEnrolments),
//       switchMap(() =>
//         from(this.claimsFacade.getClaimsByRequester()).pipe(
//           this.getEnrolments(
//             OwnedActions.updateOwnedEnrolmentsSuccess,
//             OwnedActions.updateOwnedEnrolmentsFailure
//           )
//         )
//       )
//     )
//   );





  constructor(
    private actions$: Actions,
    private store: Store,
    private claimsFacade: ClaimsFacadeService,
    private loadingService: LoadingService,
    private credentialsFacade: CredentialsFacadeService,
  ) {}
}
