import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { LayoutEffects } from './layout.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LayoutState } from './layout.reducer';
import { Router } from '@angular/router';
import * as LayoutActions from './layout.actions';
import * as LayoutSelectors from './layout.selectors';
import { AuthSelectors } from '@state';

describe('LayoutEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: LayoutEffects;
  let store: MockStore<LayoutState>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayoutEffects,
        { provide: Router, useValue: routerSpy },
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(LayoutEffects);
  });

  describe('redirectToReturnUrl$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should redirect when redirectUrl is not an empty string', (done) => {
      actions$.next(LayoutActions.redirect());
      const redirectUrl = 'test';
      store.overrideSelector(LayoutSelectors.getRedirectUrl, redirectUrl);

      effects.redirectToReturnUrl$.subscribe((resultAction) => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
        expect(resultAction).toEqual(LayoutActions.redirectSuccess());
        done();
      });
    });
  });

  describe('redirectWhenUrlIsSetAndLoggedIn$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });

    it('should redirect when redirectUrl is not an empty string', (done) => {
      const redirectUrl = 'test';

      actions$.next(LayoutActions.setRedirectUrl({ url: redirectUrl }));
      store.overrideSelector(AuthSelectors.isUserLoggedIn, true);

      effects.redirectWhenUrlIsSetAndLoggedIn$.subscribe((resultAction) => {
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
        expect(resultAction).toEqual(LayoutActions.redirectSuccess());
        done();
      });
    });
  });
});
