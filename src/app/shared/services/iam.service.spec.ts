import { TestBed } from '@angular/core/testing';

import { IamService } from './iam.service';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrService } from 'ngx-toastr';

describe('IamService', () => {
  let service: IamService;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IamService,
        provideMockStore(),
        {provide: ToastrService, useValue: toastrSpy}
      ]
    });

    service = TestBed.inject(IamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
