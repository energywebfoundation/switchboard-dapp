import { TestBed } from '@angular/core/testing';

import { DidRegistryFacadeService } from './did-registry-facade.service';
import { IamService } from '../iam.service';
import { iamServiceSpy } from '@tests';

describe('DidRegistryFacadeService', () => {
  let service: DidRegistryFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: IamService, useValue: iamServiceSpy }],
    });
    service = TestBed.inject(DidRegistryFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
