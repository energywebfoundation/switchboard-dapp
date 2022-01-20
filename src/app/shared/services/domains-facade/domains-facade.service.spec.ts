import { TestBed } from '@angular/core/testing';

import { DomainsFacadeService } from './domains-facade.service';
import { IamService } from '../iam.service';
import { iamServiceSpy } from '@tests';

describe('DomainsFacadeService', () => {
  let service: DomainsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IamService, useValue: iamServiceSpy }],
    });
    service = TestBed.inject(DomainsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
