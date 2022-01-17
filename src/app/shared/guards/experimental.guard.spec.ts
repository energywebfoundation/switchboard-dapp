import { TestBed } from '@angular/core/testing';

import { ExperimentalGuard } from './experimental.guard';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsSelectors } from '@state';

describe('ExperimentalGuard', () => {
  let guard: ExperimentalGuard;
  let store: MockStore;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    guard = TestBed.inject(ExperimentalGuard);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when experimental feature is enabled', (done) => {
    store.overrideSelector(SettingsSelectors.isExperimentalEnabled, true);
    guard.canActivate().subscribe((v) => {
      expect(v).toBeTrue();
      done();
    });
  });

  it('should return false when experimental feature is disabled', (done) => {
    store.overrideSelector(SettingsSelectors.isExperimentalEnabled, false);
    guard.canActivate().subscribe((v) => {
      expect(v).toBeFalse();
      done();
    });
  });
});
