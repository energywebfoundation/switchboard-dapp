import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ArbitraryActions from './arbitrary.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ArbitraryService } from './services/arbitrary.service';
import { of } from 'rxjs';
import { SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';

@Injectable()
export class ArbitraryEffects {

  getList$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(ArbitraryActions.getList),
        switchMap(() => this.arbitraryService.getList().pipe(
          map((list) => ArbitraryActions.getListSuccess({list})),
          catchError((err) => {
            console.error(err);
            this.toastr.error('Something went wrong while getting list', 'VC List');
            return of(ArbitraryActions.getListFailure({error: err.message}));
          })
        ))
      )
  );

  constructor(private actions$: Actions,
              private arbitraryService: ArbitraryService,
              private toastr: SwitchboardToastrService) {
  }
}
