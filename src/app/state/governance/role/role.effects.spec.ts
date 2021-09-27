import { TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RoleEffects } from './role.effects';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { dialogSpy, toastrSpy } from '@tests';

describe('RoleEffects', () => {

  let actions$: ReplaySubject<any>;
  let effects: RoleEffects;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        RoleEffects,
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {provide: MatDialog, useValue: dialogSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(RoleEffects);
  }));

});
