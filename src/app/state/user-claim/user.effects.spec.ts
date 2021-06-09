import { TestBed } from '@angular/core/testing';

import { Observable, of, ReplaySubject, throwError } from 'rxjs';


import { UserEffects } from './user.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../shared/services/loading.service';
import { IamService } from '../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import * as UserActions from './user.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { throwErr } from 'sweetalert/typings/modules/utils';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: []
  });
});
describe('UserEffects', () => {

  const iamSpy = jasmine.createSpyObj('iam', ['getUserClaims']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  // const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
  let actions$: ReplaySubject<any>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: MatDialog, useValue: dialogSpy},
        provideMockStore(),
        // { provide: ToastrService, useValue: toastrSpy },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(UserEffects);
  });

  describe('load user claims', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should return user claims success action with loaded claims', (done) => {
      const claims = [{
        id: '711fde8d-8e8c-40c8-8538-be83991bf9c2',
        did: 'roe.roles.salmon.iam.ewc',
        iat: 1612522971162,
        iss: 'did:ethr:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
        sub: 'roe.roles.salmon.iam.ewc',
        hash: 'e9a2529ca1c8f46e8af4047f40ce1fa3e184f0fce6b412261f14774ad79a60f4',
        fields: [],
        signer: 'did:ethr:0x7dD4cF86e6f143300C4550220c4eD66690a655fc',
        hashAlg: 'SHA256',
        claimType: 'roe.roles.salmon.iam.ewc',
        serviceEndpoint: 'Qma2igryU69hhH7M8nzGf6pgw3pXuCA1nGKwjdNfAh4t77'
      }];
      actions$.next(UserActions.loadUserClaims());
      iamSpy.getUserClaims.and.returnValue(of(claims));

      effects.loadUserClaims$.subscribe(resultAction => {
        expect(resultAction).toEqual(UserActions.loadUserClaimsSuccess({userClaims: claims} as any));
        done();
      });
    });
    it('should return error action when get 404 error', (done) => {
      actions$.next(UserActions.loadUserClaims());
      iamSpy.getUserClaims.and.returnValue(throwError({status: 404}));

      effects.loadUserClaims$.subscribe(resultAction => {
        expect(resultAction).toEqual(UserActions.loadUserClaimsFailure({error: {status: 404}}));
        done();
      });
    });


  });
});
