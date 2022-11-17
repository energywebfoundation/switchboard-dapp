import { TestBed, waitForAsync } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RoleEffects } from './role.effects';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, toastrSpy } from '@tests';
import { RoleService } from './services/role.service';
import * as RoleActions from './role.actions';
import { IRole } from 'iam-client-lib';
import { EnvService } from '../../../shared/services/env/env.service';

describe('RoleEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: RoleEffects;
  const roleServiceSpy = jasmine.createSpyObj('RoleService', ['getRoleList']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        RoleEffects,
        { provide: RoleService, useValue: roleServiceSpy },
        { provide: SwitchboardToastrService, useValue: toastrSpy },
        { provide: EnvService, useValue: { rootNamespace: 'iam.ewc' } },
        { provide: MatDialog, useValue: dialogSpy },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(RoleEffects);
  }));

  beforeEach(() => {
    actions$ = new ReplaySubject(1);
  });

  it('should dispatch failure action after getting an error', (done) => {
    actions$.next(RoleActions.getList);
    roleServiceSpy.getRoleList.and.returnValue(
      throwError({ message: 'message' })
    );

    effects.getList$.subscribe((resultAction) => {
      expect(toastrSpy.error).toHaveBeenCalled();
      expect(resultAction).toEqual(
        RoleActions.getListFailure({ error: 'message' })
      );
      done();
    });
  });

  it('should dispatch success action after getting a list of roles', (done) => {
    actions$.next(RoleActions.getList);
    roleServiceSpy.getRoleList.and.returnValue(of([{}, {}]));

    effects.getList$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        RoleActions.getListSuccess({
          list: [
            { organization: '', application: '', roleName: '' },
            { organization: '', application: '', roleName: '' },
          ] as unknown as IRole[],
          namespace: 'iam.ewc',
        })
      );
      done();
    });
  });
});
