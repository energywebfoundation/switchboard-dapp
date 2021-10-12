import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectedNetworkComponent } from './connected-network.component';
import { WalletProvider } from 'iam-client-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConnectedNetworkComponent', () => {
  let component: ConnectedNetworkComponent;
  let fixture: ComponentFixture<ConnectedNetworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectedNetworkComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedNetworkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should check if walletIcon property is set', () => {
    component.wallet = WalletProvider.WalletConnect;
    fixture.detectChanges();

    expect(component.walletIcon).toBeTruthy();
  });

  it('should check if walletIcon property is set', () => {
    component.wallet = 'Test';
    fixture.detectChanges();

    expect(component.walletIcon).toBeUndefined();
  });
});
