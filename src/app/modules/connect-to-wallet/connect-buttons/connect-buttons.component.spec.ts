import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectButtonsComponent } from './connect-buttons.component';
import { DebugElement } from '@angular/core';
import { getElement } from '@tests';
import { ProviderType } from 'iam-client-lib';
import { MetamaskProviderService } from '../../../shared/services/metamask-provider/metamask-provider.service';
import { EkcSettingsService } from '../ekc-settings/services/ekc-settings.service';

describe('ConnectButtonsComponent', () => {
  let component: ConnectButtonsComponent;
  let fixture: ComponentFixture<ConnectButtonsComponent>;
  let hostDebug;
  let connectToSpy;
  const metamaskProviderServiceSpy = jasmine.createSpyObj(
    MetamaskProviderService,
    ['getFullNetworkName', 'importMetamaskConf']
  );
  const ekcSettingsServiceSpy = jasmine.createSpyObj(EkcSettingsService, [
    'edit',
  ]);

  const setup = (opt?: {
    metamaskPresent?: boolean;
    metamaskDisabled?: boolean;
  }) => {
    const options = { metamaskPresent: true, metamaskDisabled: false, ...opt };
    component.metamaskPresent = options.metamaskPresent;
    component.metamaskDisabled = options.metamaskDisabled;
    fixture.detectChanges();
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectButtonsComponent],
      providers: [
        {
          provide: MetamaskProviderService,
          useValue: metamaskProviderServiceSpy,
        },
        { provide: EkcSettingsService, useValue: ekcSettingsServiceSpy },
      ],
    }).compileComponents();
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
    const { metamaskBtn, wrongNetwork } = selectors(hostDebug);

    expect(metamaskBtn).toBeTruthy();
    expect(metamaskBtn.nativeElement.disabled).toBeFalsy();
    expect(wrongNetwork).toBeFalsy();
  });

  it('should display message about not connected to volta when user have metamask', () => {
    metamaskProviderServiceSpy.getFullNetworkName.and.returnValue(
      'Volta Network'
    );

    setup({ metamaskDisabled: true });
    const { metamaskBtn, wrongNetwork } = selectors(hostDebug);

    expect(metamaskBtn).toBeTruthy();
    expect(metamaskBtn.nativeElement.disabled).toBeTruthy();
    expect(wrongNetwork).toBeTruthy();
    expect(wrongNetwork.nativeElement.innerText).toContain(
      'You are not connected to Volta Network.'
    );
  });

  it('should dispatch login action with Metamask when clicking on metamask button', () => {
    setup();
    const { metamaskBtn } = selectors(hostDebug);
    metamaskBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(ProviderType.MetaMask);
  });

  it('should dispatch login action with WalletConnect when clicking on wallet connect button', () => {
    const { mobileWalletBtn } = selectors(hostDebug);
    mobileWalletBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(ProviderType.WalletConnect);
  });

  it('should dispatch login action with Azure when clicking on Use Azure button', () => {
    component.showEkcOption = true;
    fixture.detectChanges();
    const { azureBtn } = selectors(hostDebug);
    azureBtn.nativeElement.click();

    expect(connectToSpy).toHaveBeenCalledWith(ProviderType.EKC);
  });

  it('should call method for editing ekc settings', () => {
    component.showEkcOption = true;
    fixture.detectChanges();
    const { azureSettings } = selectors(hostDebug);
    azureSettings.nativeElement.click();

    expect(ekcSettingsServiceSpy.edit).toHaveBeenCalled();
  });

  it('should not find metamask button when is not available', () => {
    component.metamaskPresent = false;
    const { metamaskBtn } = selectors(hostDebug);

    expect(metamaskBtn).toBeFalsy();
  });

  it('should not display azureBtn when showing is set to false', () => {
    component.showEkcOption = false;
    fixture.detectChanges();
    const { azureBtn } = selectors(hostDebug);

    expect(azureBtn).toBeNull();
  });
});

const selectors = (hostDebug: DebugElement) => {
  return {
    metamaskBtn: getElement(hostDebug)('metamask'),
    wrongNetwork: getElement(hostDebug)('wrong-network'),
    mobileWalletBtn: getElement(hostDebug)('mobile-wallet'),
    ewKeyBtn: getElement(hostDebug)('ew-key'),
    azureBtn: getElement(hostDebug)('azure'),
    azureSettings: getElement(hostDebug)('edit-azure-settings'),
  };
};
