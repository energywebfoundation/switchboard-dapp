import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewStakingPoolComponent } from './new-staking-pool.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StakingPoolService } from './staking-pool.service';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { utils } from 'ethers';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import { launchStakingPool } from '../../../state/stake/stake.actions';

const {parseEther} = utils;

describe('NewStakingPoolComponent', () => {
  let component: NewStakingPoolComponent;
  let fixture: ComponentFixture<NewStakingPoolComponent>;
  let hostDebug: DebugElement;
  const stakingPoolServiceStub = jasmine.createSpyObj('StakingPoolService', ['getListOfOrganizationRoles']);
  const namespace = 'test';
  let store: MockStore<UserClaimState>;

  const dispatchEvent = (el) => {
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewStakingPoolComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule
      ],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {namespace}},
        {provide: StakingPoolService, useValue: stakingPoolServiceStub},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStakingPoolComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    stakingPoolServiceStub.getListOfOrganizationRoles.and.returnValue(of([{name: 'test'}]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if button is disabled when initializing', () => {
    const {submit} = selectors(hostDebug);

    expect(component.isFormInvalid).toBeTruthy();
    expect(submit.disabled).toBeTruthy();
  });

  it('should dispatch an action to launch staking pool when clicking on submit when form is valid', () => {
    const {revenue, start, end, principal, getElement, patronRoles, submit} = selectors(hostDebug);
    const revenueAmount = 5;
    const dispatchSpy = spyOn(store, 'dispatch');
    revenue.value = revenueAmount;
    dispatchEvent(revenue);

    start.value = '7/8/2021';
    dispatchEvent(start);

    end.value = '7/15/2021';
    dispatchEvent(end);

    principal.value = 105;
    dispatchEvent(principal);

    fixture.detectChanges();

    expect(submit.disabled).toBeFalsy();

    submit.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      launchStakingPool({
        pool: {
          org: namespace,
          minStakingPeriod: 604800,
          patronRewardPortion: revenueAmount,
          patronRoles: [],
          principal: parseEther('105')
        }
      }));
  });
});

const selectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    submit: getElement('submit').nativeElement,
    revenue: getElement('revenue').nativeElement,
    start: getElement('start').nativeElement,
    end: getElement('end').nativeElement,
    patronRoles: getElement('patronRoles').nativeElement,
    principal: getElement('principal').nativeElement,
    getElement
  };
};
const todayDate = () => {
  const date = new Date(Date.now());
  return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
};
