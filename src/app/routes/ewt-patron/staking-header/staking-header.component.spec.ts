import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StakingHeaderComponent } from './staking-header.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { By } from '@angular/platform-browser';
import * as AuthActions from '../../../state/auth/auth.actions';
import { AuthSelectors, UserClaimSelectors } from '@state';
import { WalletProvider } from 'iam-client-lib';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StakingHeaderComponent', () => {
  let component: StakingHeaderComponent;
  let fixture: ComponentFixture<StakingHeaderComponent>;
  let hostDebug: DebugElement;
  let store: MockStore;

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
    store.overrideSelector(authSelectors.isUserLoggedIn, true);
    store.overrideSelector(AuthSelectors.getWalletProvider, WalletProvider.WalletConnect);
    store.overrideSelector(AuthSelectors.getAccountInfo, null);
    store.overrideSelector(UserClaimSelectors.getUserName, 'Name');
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
    store.overrideSelector(authSelectors.isUserLoggedIn, false);
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
