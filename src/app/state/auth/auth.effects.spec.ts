import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { LoadingService } from '../../shared/services/loading.service';
import { IamService } from '../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthState } from './auth.reducer';
import { AuthEffects } from './auth.effects';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: []
  });
});
describe('UserEffects', () => {

  const iamSpy = jasmine.createSpyObj('iam', ['getUserClaims', 'createSelfSignedClaim']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  let actions$: ReplaySubject<any>;
  let effects: AuthEffects;
  let store: MockStore<AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        {provide: ToastrService, useValue: toastrSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(AuthEffects);
  });


});
