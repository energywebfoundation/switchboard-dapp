import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as ApplicationActions from './application.actions';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ENSNamespaceTypes, IApp } from 'iam-client-lib';
import { IamService } from 'src/app/shared/services/iam.service';
import { of } from 'rxjs';

@Injectable()
export class ApplicationEffects {

  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.getList),
      switchMap(() => this.iamService.wrapWithLoadingService(this.iamService.getENSTypesByOwner(ENSNamespaceTypes.Application)).pipe(
          map((list: IApp[]) => ApplicationActions.getListSuccess({list})),
          catchError((err) => {
            console.error(err);
            this.toastr.error('Something went wrong while getting list of applications', 'Application');
            return of(ApplicationActions.getListFailure({error: err.message}));
          })
        )
      )
    )
  );

  constructor(private actions$: Actions,
              private store: Store,
              private dialog: MatDialog,
              private iamService: IamService,
              private toastr: SwitchboardToastrService
  ) {
  }

}
