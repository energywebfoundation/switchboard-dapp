import { TestBed } from '@angular/core/testing';

import { IamService } from './iam.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('IamService', () => {
  let service: IamService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IamService, provideMockStore()]
    });

    service = TestBed.inject(IamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
