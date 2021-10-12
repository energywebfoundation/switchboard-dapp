import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakingHeaderComponent } from './staking-header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { By } from '@angular/platform-browser';
import * as AuthActions from '../../../state/auth/auth.actions';
import { AuthSelectors, UserClaimSelectors } from '@state';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AccountInfo } from 'iam-client-lib/dist/src/iam';

describe('StakingHeaderComponent', () => {
  let component: StakingHeaderComponent;
  let fixture: ComponentFixture<StakingHeaderComponent>;
  let hostDebug: DebugElement;
  let store: MockStore;
  let setup = (data?: { isLoggedIn?: boolean, walletProvider?: any, accountInfo?: AccountInfo, userName?: string }) => {
    store.overrideSelector(authSelectors.isUserLoggedIn, data?.isLoggedIn || true);
    store.overrideSelector(AuthSelectors.getWalletProvider, data?.walletProvider);
    store.overrideSelector(AuthSelectors.getAccountInfo, data?.accountInfo);
    store.overrideSelector(UserClaimSelectors.getUserName, data?.userName);
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StakingHeaderComponent],
      imports: [MatMenuModule, NoopAnimationsModule],
      providers: [
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakingHeaderComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should call logout action when clicking on logout button', () => {
    setup();
    fixture.detectChanges();
    const dispatchSpy = spyOn(store, 'dispatch');
    const {menuTrigger} = selectors(hostDebug);
    menuTrigger.nativeElement.click();
    fixture.detectChanges();

    const {logout} = selectors(hostDebug);
    logout.nativeElement.click();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });

  it('should not render logout button when user is not logged in', () => {
    setup({isLoggedIn: false});
    fixture.detectChanges();

    const {logout} = selectors(hostDebug);

    expect(logout).toBeFalsy();
  });
});
const selectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));
  return {
    logout: getElement('logout'),
    menuTrigger: getElement('menu-trigger')
  };
};
