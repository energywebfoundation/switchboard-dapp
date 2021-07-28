import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';
import { By } from '@angular/platform-browser';
import { WalletProvider } from 'iam-client-lib';

describe('ConnectToWalletDialogComponent', () => {
  let component: ConnectToWalletDialogComponent;
  let fixture: ComponentFixture<ConnectToWalletDialogComponent>;
  let hostDebug: DebugElement;
  let store: MockStore;

  const setup = (opt?: {
    metamaskPresent?: boolean,
    metamaskDisabled?: boolean
  }) => {
    const options = {metamaskPresent: true, metamaskDisabled: false, ...opt};
    store.overrideSelector(authSelectors.isMetamaskPresent, options.metamaskPresent);
    store.overrideSelector(authSelectors.isMetamaskDisabled, options.metamaskDisabled);
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectToWalletDialogComponent],
      providers: [
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectToWalletDialogComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
  });

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should check metamask presence', () => {
    setup();
    const {metamaskBtn, noVolta} = selectors(hostDebug);

    expect(metamaskBtn).toBeTruthy();
    expect(metamaskBtn.nativeElement.disabled).toBeFalsy();
    expect(noVolta).toBeFalsy();
  });

  it('should display message about not connected to volta when user have metamask', () => {
    setup({metamaskDisabled: true});
    const {metamaskBtn, noVolta} = selectors(hostDebug);

    expect(metamaskBtn).toBeTruthy();
    expect(metamaskBtn.nativeElement.disabled).toBeTruthy();
    expect(noVolta).toBeTruthy();
    expect(noVolta.nativeElement.innerText).toContain('You are not connected to Volta Network.');
  });

  it('should dispatch login action with Metamask when clicking on metamask button', () => {
    setup();
    const {metamaskBtn} = selectors(hostDebug);
    const dispatchSpy = spyOn(store, 'dispatch');
    metamaskBtn.nativeElement.click();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login({provider: WalletProvider.MetaMask}));
  });

  it('should dispatch login action with WalletConnect when clicking on wallet connect button', () => {
    setup();
    const {mobileWalletBtn} = selectors(hostDebug);
    const dispatchSpy = spyOn(store, 'dispatch');
    mobileWalletBtn.nativeElement.click();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login({provider: WalletProvider.WalletConnect}));
  });

  it('should not find metamask button when is not available', () => {
    setup({metamaskPresent: false});
    const {metamaskBtn} = selectors(hostDebug);

    expect(metamaskBtn).toBeFalsy();
  });
});
const selectors = (hostDebug: DebugElement) => {
  const getElement = (id, postSelector = '') => hostDebug.query(By.css(`[data-qa-id=${id}] ${postSelector}`));

  return {
    metamaskBtn: getElement('metamask'),
    noVolta: getElement('no-volta'),
    mobileWalletBtn: getElement('mobile-wallet'),
    ewKeyBtn: getElement('ew-key'),
    getElement
  };
};
