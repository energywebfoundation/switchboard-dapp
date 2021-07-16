import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { StakeEffects } from './stake.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { LoadingService } from '../../shared/services/loading.service';
import { IamService } from '../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { StakeState } from './stake.reducer';
import * as userSelectors from '../user-claim/user.selectors';
import * as userActions from '../user-claim/user.actions';
import { finalize } from 'rxjs/operators';

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
  let effects: StakeEffects;
  let store: MockStore<StakeState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StakeEffects,
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        {provide: ToastrService, useValue: toastrSpy},
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(StakeEffects);
  });


});
