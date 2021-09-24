import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as ApplicationActions from './application.actions';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

@Injectable()
export class ApplicationEffects {

  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.getList),
    )
  );

  constructor(private actions$: Actions,
              private store: Store,
              private dialog: MatDialog,
              private toastr: SwitchboardToastrService
  ) {
  }

}
