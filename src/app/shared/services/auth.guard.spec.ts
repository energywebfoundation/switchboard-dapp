import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from './login/login.service';
import { RouterConst } from '../../routes/router-const';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const loginServSpy = jasmine.createSpyObj('LoginService', [
    'isSessionActive',
  ]);
  const dummyRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LoginService, useValue: loginServSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true and navigate to dashboard page with returnUrl when session is active', (done) => {
    loginServSpy.isSessionActive.and.returnValue(true);

    expect(
      guard.canActivate(dummyRoute, fakeRouterState(RouterConst.Enrolment))
    ).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith([RouterConst.Dashboard], {
      queryParams: { returnUrl: RouterConst.Enrolment },
    });
    done();
  });

  it('should return true and navigate to dashboard page when session is active', (done) => {
    loginServSpy.isSessionActive.and.returnValue(true);

    expect(
      guard.canActivate(dummyRoute, fakeRouterState(RouterConst.Welcome))
    ).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith([RouterConst.Dashboard]);
    done();
  });

  it('should navigate to welcome page when session is not active', (done) => {
    loginServSpy.isSessionActive.and.returnValue(false);

    expect(
      guard.canActivate(dummyRoute, fakeRouterState(RouterConst.Enrolment))
    ).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith([RouterConst.Welcome]);
    done();
  });
});
