import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';


import { UserEffects } from './user.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions( () => actions$),
      ],
    });

    effects = TestBed.inject(UserEffects);
  });
});
