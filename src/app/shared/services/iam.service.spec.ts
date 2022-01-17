import { TestBed } from '@angular/core/testing';

import { IamService } from './iam.service';
import { EnvService } from './env/env.service';

describe('IamService', () => {
  let service: IamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IamService, { provide: EnvService, useValue: {} }],
    });

    service = TestBed.inject(IamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
