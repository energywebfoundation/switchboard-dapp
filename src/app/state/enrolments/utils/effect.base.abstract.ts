import { from, Observable, of } from 'rxjs';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { LoadingService } from '../../../shared/services/loading.service';

export abstract class EffectBaseAbstract {
  constructor(private loadingService: LoadingService) {}
  protected abstract getClaim(enrolmentId: string): Observable<EnrolmentClaim>;
  protected abstract getClaims(): Observable<EnrolmentClaim[]>;

  updateEnrolment(successAction, failureAction) {
    return (source: Observable<{ id: string }>) =>
      source.pipe(
        switchMap(({ id }) =>
          from(this.getClaim(id)).pipe(
            map((updatedEnrolment: EnrolmentClaim) =>
              successAction({ enrolment: updatedEnrolment })
            ),
            catchError((e) => {
              console.error(e);
              return of(
                failureAction({
                  error: e.message,
                })
              );
            })
          )
        )
      );
  }

  protected getEnrolments(successAction, failureAction, displayLoader = true) {
    return (source: Observable<EnrolmentClaim[]>) => {
      return source.pipe(
        tap(() => {
          if (displayLoader) {
            this.loadingService.show();
          }
        }),
        switchMap(() =>
          this.getClaims().pipe(
            map((enrolments: EnrolmentClaim[]) =>
              successAction({ enrolments })
            ),
            catchError((e) => {
              console.error(e);
              return of(failureAction({ error: e.message }));
            }),
            finalize(() => {
              if (displayLoader) {
                this.loadingService.hide();
              }
            })
          )
        )
      );
    };
  }
}
