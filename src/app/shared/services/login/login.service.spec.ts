import { TestBed, waitForAsync } from '@angular/core/testing';

import { LoginService } from './login.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';
import { IamService, PROVIDER_TYPE } from '../iam.service';
import { IamListenerService } from '../iam-listener/iam-listener.service';
import { from, of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { iamServiceSpy, loadingServiceSpy, toastrSpy } from '@tests';
import { IS_ETH_SIGNER, ProviderType, PUBLIC_KEY } from 'iam-client-lib';
import { MetamaskProviderService } from '../metamask-provider/metamask-provider.service';

describe('LoginService', () => {
  let service: LoginService;
  let metamaskServiceSpy;
  const iamListenerServiceSpy = jasmine.createSpyObj('IamListenerService', [
    'setListeners',
  ]);

  beforeEach(() => {
    metamaskServiceSpy = jasmine.createSpyObj('MetamaskProviderService', [
      'importMetamaskConf',
    ]);
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: ToastrService, useValue: toastrSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: IamService, useValue: iamServiceSpy },
        { provide: IamListenerService, useValue: iamListenerServiceSpy },
        { provide: MetamaskProviderService, useValue: metamaskServiceSpy },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass further value for isSessionActive', () => {
    const localStore = {
      [PROVIDER_TYPE]: 'type',
      [PUBLIC_KEY]: 'public key',
      [IS_ETH_SIGNER]: true,
    };
    spyOn(window.localStorage, 'getItem').and.callFake((key) =>
      key in localStore ? localStore[key] : null
    );
    expect(service.isSessionActive()).toBe(true);
  });

  it('should return true when login is successful', waitForAsync(() => {
    iamServiceSpy.initializeConnection.and.returnValue(
      of({
        did: '0x',
        connected: true,
        userClosedModal: false,
      })
    );
    iamServiceSpy.getPublicKey.and.returnValue(of('public key'));
    iamServiceSpy.isEthSigner.and.returnValue(of('true'));
    const getSpy = jasmine.createSpy().and.returnValue(ProviderType.MetaMask);
    Object.defineProperty(IamService, 'providerType', { get: getSpy });

    service.login().subscribe(({ success }) => {
      expect(success).toBe(true);
    });
  }));

  it('should return false when did is null', waitForAsync(() => {
    iamServiceSpy.initializeConnection.and.returnValue(
      of({ connected: true, userClosedModal: false })
    );
    service
      .login()
      .pipe(take(1))
      .subscribe(({ success }) => {
        expect(success).toBe(false);
      });
  }));

  it('should display random error with toastr', waitForAsync(() => {
    iamServiceSpy.initializeConnection.and.returnValue(
      throwError({ message: 'Sample Error' })
    );
    service
      .login()
      .pipe(take(1))
      .subscribe(({ success }) => {
        expect(success).toBe(false);
        expect(toastrSpy.error).toHaveBeenCalledWith('Sample Error');
      });
  }));

  it('should display error with toastr about pending notifications', () => {
    iamServiceSpy.initializeConnection.and.returnValue(
      throwError({ message: "Request of type 'wallet_requestPermissions'" })
    );
    service
      .login()
      .pipe(take(1))
      .subscribe(({ success }) => {
        expect(success).toBe(false);
        expect(toastrSpy.error).toHaveBeenCalledWith(
          'Please check if you do not have pending notifications in your wallet'
        );
      });
  });
});
