import { TestBed } from '@angular/core/testing';

import { of, ReplaySubject } from 'rxjs';

import { SettingsEffects } from './settings.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UrlService } from '../../shared/services/url-service/url.service';
import * as SettingsActions from './settings.actions';
import { RouterConst } from '../../routes/router-const';

describe('SettingsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: SettingsEffects;
  const urlServiceSpy = jasmine.createSpyObj('UrlService', ['goTo', 'current']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        { provide: UrlService, useValue: urlServiceSpy },
      ],
    });

    effects = TestBed.inject(SettingsEffects);
  });

  describe('redirectFromAssetsToDashboard$', () => {
    beforeEach(() => {
      actions$ = new ReplaySubject(1);
    });
    it('should redirect when current page is assets', (done) => {
      urlServiceSpy.current.and.returnValue(of(RouterConst.Assets));
      actions$.next(SettingsActions.disableExperimental());

      effects.redirectFromAssetsToDashboard$.subscribe(() => {
        expect(urlServiceSpy.goTo).toHaveBeenCalledWith(RouterConst.Dashboard);
        done();
      });
    });
  });
});
