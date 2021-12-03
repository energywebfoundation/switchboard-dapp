import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { SettingsEffects } from './settings.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsState } from './settings.reducer';

describe('SettingsEffects', () => {

  let actions$: ReplaySubject<any>;
  let effects: SettingsEffects;
  let store: MockStore<SettingsState>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(SettingsEffects);
  });


});
