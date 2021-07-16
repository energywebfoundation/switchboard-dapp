import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WithdrawComponent } from './withdraw.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StakeState } from '../../../state/stake/stake.reducer';

describe('WithdrawComponent', () => {
  let component: WithdrawComponent;
  let fixture: ComponentFixture<WithdrawComponent>;
  let store: MockStore<StakeState>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WithdrawComponent],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
