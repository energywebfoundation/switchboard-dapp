import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EnrolmentRequestsEffects } from './requested.effects';

describe('OwnedEnrolmentsEffects', () => {
  let actions$: ReplaySubject<any>;
  let effects: EnrolmentRequestsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnrolmentRequestsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(EnrolmentRequestsEffects);
  });
});
