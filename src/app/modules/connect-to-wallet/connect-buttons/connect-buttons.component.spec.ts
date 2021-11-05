import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectButtonsComponent } from './connect-buttons.component';
import { DebugElement } from '@angular/core';
import { getElement } from '@tests';
import { WalletProvider } from 'iam-client-lib';

describe('ConnectButtonsComponent', () => {
  let component: ConnectButtonsComponent;
  let fixture: ComponentFixture<ConnectButtonsComponent>;
  let hostDebug;
  let connectToSpy;
  const setup = (opt?: {
    metamaskPresent?: boolean,
    metamaskDisabled?: boolean
  }) => {
    const options = {metamaskPresent: true, metamaskDisabled: false, ...opt};
    component.metamaskPresent = options.metamaskPresent;
    component.metamaskDisabled = options.metamaskDisabled;
    fixture.detectChanges();
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectButtonsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectButtonsComponent);
    component = fixture.componentInstance;
    hostDebug = fixture.debugElement;
    connectToSpy = spyOn(component.connectTo, 'emit');
  });

  it('should create', () => {
    fixture.detectChanges();
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
    metamaskBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(WalletProvider.MetaMask);
  });

  it('should dispatch login action with WalletConnect when clicking on wallet connect button', () => {
    const {mobileWalletBtn} = selectors(hostDebug);
    mobileWalletBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(WalletProvider.WalletConnect);
  });

  it('should dispatch login action with Azure when clicking on Use Azure button', () => {
    const {azureBtn} = selectors(hostDebug);
    azureBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(WalletProvider.EKC);
  });

  it('should not find metamask button when is not available', () => {
    component.metamaskPresent = false;
    const {metamaskBtn} = selectors(hostDebug);

    expect(metamaskBtn).toBeFalsy();
  });
});

const selectors = (hostDebug: DebugElement) => {

  return {
    metamaskBtn: getElement(hostDebug)('metamask'),
    noVolta: getElement(hostDebug)('no-volta'),
    mobileWalletBtn: getElement(hostDebug)('mobile-wallet'),
    ewKeyBtn: getElement(hostDebug)('ew-key'),
    azureBtn: getElement(hostDebug)('azure'),
  };
};
