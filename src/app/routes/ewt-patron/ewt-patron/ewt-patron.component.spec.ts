import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EwtPatronComponent } from './ewt-patron.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StakeState } from '../../../state/stake/stake.reducer';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import { LastDigitsPipe } from '../pipes/last-digits.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IamService } from '../../../shared/services/iam.service';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as StakeActions from '../../../state/stake/stake.actions';

describe('EwtPatronComponent', () => {
  let component: EwtPatronComponent;
  let fixture: ComponentFixture<EwtPatronComponent>;
  let store: MockStore<StakeState>;
  const iamSpy = jasmine.createSpyObj('iam', ['login', 'disconnect', 'clearWaitSignatureTimer', 'waitForSignature']);
  const mockActivatedRoute = {queryParams: of({org: 'org'})};
  const setUp = (options?: {
    balance?: string;
    reward?: number;
    performance?: number;
    loggedIn?: boolean;
  }) => {
    const opt = {
      balance: '0',
      reward: 10,
      performance: 100,
      loggedIn: true,
      ...options
    };
    store.overrideSelector(stakeSelectors.getBalance, opt.balance);
    store.overrideSelector(stakeSelectors.getAnnualReward, opt.reward);
    store.overrideSelector(stakeSelectors.getPerformance, opt.performance);
    store.overrideSelector(authSelectors.isUserLoggedIn, opt.loggedIn);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EwtPatronComponent, LastDigitsPipe],
      providers: [
        {provide: IamService, useValue: {iam: iamSpy}},
        {
          provide: MatDialog, useValue: {
            open: () => {
            }
          }
        },
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
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(StakeActions.setOrganization({organization: 'org'}));
  });
});
