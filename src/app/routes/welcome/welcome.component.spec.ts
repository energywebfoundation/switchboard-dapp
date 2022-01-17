import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeComponent } from './welcome.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { MockActivatedRoute } from '@tests';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import * as authSelectors from '../../state/auth/auth.selectors';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProviderType } from 'iam-client-lib';
import { AuthActions } from '@state';
import { EnvService } from '../../shared/services/env/env.service';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let mockActivatedRoute;
  let store: MockStore;

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      imports: [MatButtonModule, MatCardModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: EnvService, useValue: {} },
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    store.overrideSelector(authSelectors.isMetamaskDisabled, false);
    store.overrideSelector(authSelectors.isMetamaskPresent, true);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should not set returnUrl when query param is different than returnUrl', () => {
    mockActivatedRoute.testParams = { return: 'val' };
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    component.login(ProviderType.MetaMask);
    expect(dispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        provider: ProviderType.MetaMask,
        returnUrl: undefined,
      })
    );
  });

  it('should dispatch object containing returnUrl value.', () => {
    mockActivatedRoute.testParams = { returnUrl: 'value' };
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    component.login(ProviderType.MetaMask);
    expect(dispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        provider: ProviderType.MetaMask,
        returnUrl: 'value',
      })
    );
  });

  it('should dispatch login action when there is privateKey stored in localstorage', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return 'value';
    });
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(
      jasmine.objectContaining(
        AuthActions.welcomeLogin({
          provider: ProviderType.PrivateKey,
          returnUrl: undefined,
        })
      )
    );
  });
});
