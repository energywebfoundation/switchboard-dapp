import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OwnedEnrolmentsEffects } from './owned.effects';

describe('OwnedEnrolmentsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: OwnedEnrolmentsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnedEnrolmentsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OwnedEnrolmentsEffects);
  });
});
