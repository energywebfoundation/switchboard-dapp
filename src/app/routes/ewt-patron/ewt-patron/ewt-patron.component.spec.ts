import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EwtPatronComponent } from './ewt-patron.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StakeState } from '../../../state/stake/stake.reducer';
import { LastDigitsPipe } from '../pipes/last-digits.pipe';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '@tests';
import { AuthActions, PoolActions, PoolSelectors } from '@state';
import { LoginService } from '../../../shared/services/login/login.service';

describe('EwtPatronComponent', () => {
  let component: EwtPatronComponent;
  let fixture: ComponentFixture<EwtPatronComponent>;
  let store: MockStore<StakeState>;
  const loginServiceSpy = jasmine.createSpyObj(LoginService, ['isSessionActive']);
  const mockActivatedRoute = new MockActivatedRoute();
  const setUp = (options?: {
    balance?: string;
    reward?: number;
    performance?: number;
  }) => {
    const opt = {
      balance: '0',
      reward: 10,
      performance: 100,
      ...options
    };
    store.overrideSelector(PoolSelectors.getBalance, opt.balance);
    store.overrideSelector(PoolSelectors.getAnnualReward, opt.reward);
    store.overrideSelector(PoolSelectors.getPerformance, opt.performance);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EwtPatronComponent, LastDigitsPipe],
      providers: [
        {provide: LoginService, useValue: loginServiceSpy},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
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

  it('should set an organization', () => {
    setUp();
    mockActivatedRoute.testParams = {org: 'org'};
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(PoolActions.setOrganization({organization: 'org'}));
  });

  it('should dispatch action to reinitialize login', () => {
    setUp();
    mockActivatedRoute.testParams = {org: 'org'};
    const dispatchSpy = spyOn(store, 'dispatch');
    loginServiceSpy.isSessionActive.and.returnValue(true);
    fixture.detectChanges();

    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.reinitializeAuthForPatron());
  });

  it('should dispatch action to open login dialog', () => {
    setUp();
    mockActivatedRoute.testParams = {org: 'org'};
    const dispatchSpy = spyOn(store, 'dispatch');
    loginServiceSpy.isSessionActive.and.returnValue(false);
    fixture.detectChanges();

    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.openLoginDialog());
  });
});
