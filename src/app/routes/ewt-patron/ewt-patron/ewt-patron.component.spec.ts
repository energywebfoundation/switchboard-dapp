import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EwtPatronComponent } from './ewt-patron.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StakeState } from '../../../state/stake/stake.reducer';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import { LastDigitsPipe } from '../pipes/last-digits.pipe';

xdescribe('EwtPatronComponent', () => {
  let component: EwtPatronComponent;
  let fixture: ComponentFixture<EwtPatronComponent>;
  let store: MockStore<StakeState>;
  const setUp = () => {
    store.overrideSelector(stakeSelectors.getBalance, '0');
    store.overrideSelector(stakeSelectors.getAnnualReward, 10);
    store.overrideSelector(stakeSelectors.getPerformance, 100);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EwtPatronComponent, LastDigitsPipe],
      providers: [
        {provide: MatDialog, useValue: {open: () => {}}},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EwtPatronComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
