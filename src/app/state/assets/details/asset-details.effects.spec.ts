import { TestBed } from '@angular/core/testing';

import { ReplaySubject } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AssetDetailsEffects } from './asset-details.effects';

describe('AssetDetailsEffects', () => {

  let actions$: ReplaySubject<any>;
  let effects: AssetDetailsEffects;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetDetailsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
      ],
    });
    store = TestBed.inject(MockStore);

    effects = TestBed.inject(AssetDetailsEffects);
  });
});
