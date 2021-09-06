import { TestBed } from '@angular/core/testing';

import { IamService } from './iam.service';

describe('IamService', () => {
  let service: IamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IamService,
      ]
    });

    service = TestBed.inject(IamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
