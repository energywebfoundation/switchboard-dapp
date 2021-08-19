import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';
import { IamService } from '../iam.service';

describe('LoginService', () => {
  let service: LoginService;
  const toastrySpy = jasmine.createSpyObj('ToastrService', ['error']);
  const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const iamServiceSpy = jasmine.createSpyObj('IamService', ['isSessionActive']);

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {provide: ToastrService, useValue: toastrySpy},
        {provide: LoadingService, useValue: loadingSpy},
        {provide: IamService, useValue: iamServiceSpy}
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
});
