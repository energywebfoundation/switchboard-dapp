import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakeComponent } from './stake.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LastDigitsPipe } from '../pipes/last-digits.pipe';

describe('StakeComponent', () => {
  let component: StakeComponent;
  let fixture: ComponentFixture<StakeComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StakeComponent, LastDigitsPipe],
      providers: [
        provideMockStore({
          initialState: {
            pool: {
              balance: '0',
              performance: 100,
              annualReward: 10,
              reward: '0',
              organization: '',
              userStake: null,
              withdrawing: false,
              organizationDetails: null,
            }

          }
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate stake amount when taking 100%', () => {
    component.tokenAmount = 10.123;
    component.calcStakeAmount(100);

    expect(component.amountToStake.value).toEqual(10.123);
  });

  it('should calculate stake amount when taking 50%', () => {
    component.tokenAmount = 10.12;
    component.calcStakeAmount(50);

    expect(component.amountToStake.value).toEqual(5.06);
  });
});
