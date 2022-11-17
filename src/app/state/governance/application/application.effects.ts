import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as ApplicationActions from './application.actions';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IApp, NamespaceType } from 'iam-client-lib';
import { IamService } from 'src/app/shared/services/iam.service';
import { of } from 'rxjs';
import { EnvService } from '../../../shared/services/env/env.service';
import { DomainUtils } from '@utils';

@Injectable()
export class ApplicationEffects {
  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.getList),
      switchMap(() =>
        this.iamService
          .wrapWithLoadingService(
            this.iamService.getENSTypesByOwner(NamespaceType.Application)
          )
          .pipe(
            map((list: IApp[]) =>
              list.map((app) => ({
                ...app,
                containsRoles: app?.roles?.length > 0,
              }))
            ),
            map((items) =>
              items.map((item) => ({
                ...item,
                organization: DomainUtils.getOrgName(item.namespace),
                application: item.name ?? '',
              }))
            ),
            map((list: IApp[]) =>
              ApplicationActions.getListSuccess({
                list,
                namespace: this.envService.rootNamespace,
              })
            ),
            catchError((err) => {
              console.error(err);
              this.toastr.error(
                'Something went wrong while getting list of applications',
                'Application'
              );
              return of(
                ApplicationActions.getListFailure({ error: err.message })
              );
            })
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private envService: EnvService
  ) {}
}
