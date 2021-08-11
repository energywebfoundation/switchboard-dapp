import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../loading.service';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {

    const toastrySpy = jasmine.createSpyObj('ToastrService', [])
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide'])

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {provide: ToastrService, useValue: {}},
        {provide: LoadingService, useValue: {}}
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
