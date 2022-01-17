/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { SettingsEffects } from './settings.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('SettingsEffects', () => {
  let actions$: ReplaySubject<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
  });
});
