import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject, throwError } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OwnedEnrolmentsEffects } from './owned.effects';
import * as OwnedActions from './owned.actions';
import { LoadingService } from '../../../shared/services/loading.service';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

describe('OwnedEnrolmentsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: OwnedEnrolmentsEffects;
  let loadingServiceSpy;
  let claimsFacadeSpy;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getClaimsByRequester',
      'getClaimByRequester',
    ]);
    TestBed.configureTestingModule({
      providers: [
        OwnedEnrolmentsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OwnedEnrolmentsEffects);
  });

  describe('getOwnedEnrolments$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch failure action on thrown error ', (done) => {
      claimsFacadeSpy.getClaimsByRequester.and.returnValue(
        throwError(() => ({ message: 'Error' }))
      );
      actions$.next(OwnedActions.getOwnedEnrolments());

      effects.getOwnedEnrolments$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OwnedActions.getOwnedEnrolmentsFailure({ error: 'Error' })
        );
        done();
      });
    });

    it('should dispatch success action when getting enrolments ', (done) => {
      const enrolment = {
        claimType: 'role.roles.org.iam.ewc',
        createdAt: '2021-12-06T20:43:35.471Z',
      };
      claimsFacadeSpy.getClaimsByRequester.and.returnValue(of([enrolment]));

      actions$.next(OwnedActions.getOwnedEnrolments());

      effects.getOwnedEnrolments$.subscribe((resultAction) => {
        expect(loadingServiceSpy.show).toHaveBeenCalled();
        expect(resultAction).toEqual(
          OwnedActions.getOwnedEnrolmentsSuccess({
            enrolments: [
              {
                ...enrolment,
              } as any,
            ],
          })
        );
        done();
      });
    });
  });

  describe('updateEnrolment$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should call success action', (done) => {
      const enrolment = {
        claimType: 'role.roles.org.iam.ewc',
        createdAt: '2021-12-06T20:43:35.471Z',
        id: '1',
      } as EnrolmentClaim;
      claimsFacadeSpy.getClaimByRequester.and.returnValue(of(enrolment));

      actions$.next(OwnedActions.updateEnrolment({ id: '1' }));

      effects.updateEnrolment$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OwnedActions.updateEnrolmentSuccess({
            enrolment,
          })
        );
        done();
      });
    });

    it('should return failure action', (done) => {
      claimsFacadeSpy.getClaimByRequester.and.returnValue(
        throwError(() => ({ message: 'Error' }))
      );
      actions$.next(OwnedActions.updateEnrolment({ id: '1' }));

      effects.updateEnrolment$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          OwnedActions.updateEnrolmentFailure({ error: 'Error' })
        );
        done();
      });
    });
  });
});
