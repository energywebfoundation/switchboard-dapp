import { TestBed, waitForAsync } from '@angular/core/testing';

import { LoginService } from './login.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';
import { IamService } from '../iam.service';
import { IamListenerService } from '../iam-listener/iam-listener.service';
import { from, of } from 'rxjs';

describe('LoginService', () => {
  let service: LoginService;
  const toastrySpy = jasmine.createSpyObj('ToastrService', ['error']);
  const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const iamServiceSpy = jasmine.createSpyObj('IamService', ['isSessionActive', 'initializeConnection']);
  const iamListenerServiceSpy = jasmine.createSpyObj('IamListenerService', ['setListeners']);

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {provide: ToastrService, useValue: toastrySpy},
        {provide: LoadingService, useValue: loadingSpy},
        {provide: IamService, useValue: iamServiceSpy},
        {provide: IamListenerService, useValue: iamListenerServiceSpy}
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass further value for isSessionActive', () => {
    iamServiceSpy.isSessionActive.and.returnValue(true);
    expect(service.isSessionActive()).toBe(true);
  });

  it('should return true when login is successful', waitForAsync(() => {
    iamServiceSpy.initializeConnection.and.returnValue(of({
      did: '0x',
      connected: true,
      userClosedModal: false
    }));

    from(service.login()).subscribe((result) => {
      expect(result).toBe(true);
    });
  }));

  it('should return false when did is null', waitForAsync(() => {
    iamServiceSpy.initializeConnection.and.returnValue(of({connected: true, userClosedModal: false}));
    from(service.login()).subscribe((result) => {
      expect(result).toBe(false);
    });

  }));
});
