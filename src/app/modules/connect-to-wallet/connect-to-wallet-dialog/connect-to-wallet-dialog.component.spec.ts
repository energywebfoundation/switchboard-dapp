import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { ProviderType } from 'iam-client-lib';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnvService } from '../../../shared/services/env/env.service';

describe('ConnectToWalletDialogComponent', () => {
  let component: ConnectToWalletDialogComponent;
  let fixture: ComponentFixture<ConnectToWalletDialogComponent>;
  let store: MockStore;

  const setup = (options?: {
    metamaskPresent?: boolean;
    metamaskDisabled?: boolean;
  }) => {
    store.overrideSelector(
      authSelectors.isMetamaskPresent,
      options?.metamaskPresent ?? true
    );
    store.overrideSelector(
      authSelectors.isMetamaskDisabled,
      options?.metamaskDisabled ?? false
    );
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectToWalletDialogComponent],
      providers: [
        provideMockStore(),
        { provide: MAT_DIALOG_DATA, useValue: { navigateOnTimeout: true } },
        { provide: EnvService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectToWalletDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should dispatch action for login.', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    component.login(ProviderType.MetaMask);
    expect(dispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        provider: ProviderType.MetaMask,
        navigateOnTimeout: true,
      })
    );
  });
});
