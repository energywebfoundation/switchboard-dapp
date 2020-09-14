import { TestBed } from '@angular/core/testing';

import { IamService } from './iam.service';

describe('IamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IamService = TestBed.get(IamService);
    expect(service).toBeTruthy();
  });
});
