import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as RoleActions from './role.actions';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IRole } from 'iam-client-lib';
import { of } from 'rxjs';
import { RoleService } from './services/role.service';
import { EnvService } from '../../../shared/services/env/env.service';
import { DomainUtils } from '@utils';

@Injectable()
export class RoleEffects {
  getList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleActions.getList),
      switchMap(() =>
        this.roleService.getRoleList().pipe(
          map((items) =>
            items.map((item) => ({
              ...item,
              organization: DomainUtils.getOrgName(item.namespace) ?? '',
              application: DomainUtils.getAppName(item.namespace) ?? '',
              roleName: item.name ?? '',
            }))
          ),
          map((list: IRole[]) =>
            RoleActions.getListSuccess({
              list,
              namespace: this.envService.rootNamespace,
            })
          ),
          catchError((err) => {
            console.error(err);
            this.toastr.error(
              'Something went wrong while getting list of roles',
              'Roles'
            );
            return of(RoleActions.getListFailure({ error: err.message }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private roleService: RoleService,
    private toastr: SwitchboardToastrService,
    private envService: EnvService
  ) {}
}
