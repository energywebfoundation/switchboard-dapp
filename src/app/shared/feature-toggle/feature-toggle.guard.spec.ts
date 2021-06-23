import { TestBed } from '@angular/core/testing';

import { FeatureToggleGuard } from './feature-toggle.guard';
import { FEAT_TOGGLE_TOKEN } from './feature-toggle.token';

describe('FeatureToggleGuard', () => {
  let guard: FeatureToggleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: FEAT_TOGGLE_TOKEN, useValue: {featureVisible: true}}]
    });
    guard = TestBed.inject(FeatureToggleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
