import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakeListComponent } from './stake-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as stakeSelectors from '../../../state/stake/stake.selectors';

describe('StakeListComponent', () => {
  let component: StakeListComponent;
  let fixture: ComponentFixture<StakeListComponent>;
  let store: MockStore;
  beforeEach(waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [StakeListComponent],
      providers: [
        {provide: Router, useValue: {}},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    store.overrideSelector(stakeSelectors.getProviders, []);
    expect(component).toBeTruthy();
  });
});
