import { TestBed } from '@angular/core/testing';
import { of, ReplaySubject, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RevokableEnrolmentEffects } from './revokable.effects';
import * as RevokableActions from './revokable.actions';
import { LoadingService } from '../../../shared/services/loading.service';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

describe('RevokableEnrolmentsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: RevokableEnrolmentEffects;
  let loadingServiceSpy;
  let claimsFacadeSpy;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'show',
      'hide',
    ]);
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getClaimsByRevoker',
      'getClaimByRevoker',
    ]);
    TestBed.configureTestingModule({
      providers: [
        RevokableEnrolmentEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ClaimsFacadeService, useValue: claimsFacadeSpy },
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(RevokableEnrolmentEffects);
  });

  describe('getRevokableEnrolments$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should dispatch failure action on thrown error ', (done) => {
      claimsFacadeSpy.getClaimsByRevoker.and.returnValue(
        throwError(() => ({ message: 'Error' }))
      );
      actions$.next(RevokableActions.getRevocableEnrolments());

      effects.getRevokableEnrolments$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          RevokableActions.getRevocableEnrolmentsFailure({ error: 'Error' })
        );
        done();
      });
    });

    it('should dispatch success action when getting enrolments ', (done) => {
      const enrolment = {
        claimType: 'role.roles.org.iam.ewc',
        createdAt: '2021-12-06T20:43:35.471Z',
      };
      claimsFacadeSpy.getClaimsByRevoker.and.returnValue(of([enrolment]));

      actions$.next(RevokableActions.getRevocableEnrolments());

      effects.getRevokableEnrolments$.subscribe((resultAction) => {
        expect(loadingServiceSpy.show).toHaveBeenCalled();
        expect(resultAction).toEqual(
          RevokableActions.getRevocableEnrolmentsSuccess({
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
      claimsFacadeSpy.getClaimByRevoker.and.returnValue(of(enrolment));

      actions$.next(RevokableActions.updateEnrolment({ id: '1' }));

      effects.updateEnrolment$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          RevokableActions.updateEnrolmentSuccess({
            enrolment,
          })
        );
        done();
      });
    });

    it('should return failure action', (done) => {
      claimsFacadeSpy.getClaimByRevoker.and.returnValue(
        throwError(() => ({ message: 'Error' }))
      );
      actions$.next(RevokableActions.updateEnrolment({ id: '1' }));

      effects.updateEnrolment$.subscribe((resultAction) => {
        expect(resultAction).toEqual(
          RevokableActions.updateEnrolmentFailure({ error: 'Error' })
        );
        done();
      });
    });
  });
});
