import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';
import { IamService } from '../../../../shared/services/iam.service';
import { iamServiceSpy } from '@tests';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IamService, useValue: iamServiceSpy }],
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
