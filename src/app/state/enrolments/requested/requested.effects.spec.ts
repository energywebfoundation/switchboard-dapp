import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EnrolmentRequestsEffects } from './requested.effects';
import * as RequestedActions from './requested.actions';
import { LoadingService } from '../../../shared/services/loading.service';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

describe('EnrolmentRequestsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: EnrolmentRequestsEffects;
  let loadingServiceSpy;
  let claimsFacadeSpy;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getClaimsByIssuer',
    ]);
    TestBed.configureTestingModule({
      providers: [
        EnrolmentRequestsEffects,
        provideMockStore(),
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(EnrolmentRequestsEffects);
  });

  describe('getEnrolmentRequests$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch failure action on thrown error ', (done) => {
      claimsFacadeSpy.getClaimsByIssuer.and.returnValue(
        throwError({ message: 'Error' })
      );
      actions$.next(RequestedActions.getEnrolmentRequests());

      effects.getEnrolmentRequests$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          RequestedActions.getEnrolmentRequestsFailure({ error: 'Error' })
        );
        done();
      });
    });

    it('should dispatch success action when getting enrolments ', (done) => {
      const enrolment = {
        claimType: 'role.roles.org.iam.ewc',
        createdAt: '2021-12-06T20:43:35.471Z',
      };
      claimsFacadeSpy.getClaimsByIssuer.and.returnValue(of([enrolment]));
      actions$.next(RequestedActions.getEnrolmentRequests());

      effects.getEnrolmentRequests$.subscribe((resultAction) => {
        expect(loadingServiceSpy.show).toHaveBeenCalled();
        expect(resultAction).toEqual(
          RequestedActions.getEnrolmentRequestsSuccess({
            enrolments: [
              {
                ...enrolment,
              } as EnrolmentClaim,
            ],
          })
        );
        done();
      });
    });
  });
});
