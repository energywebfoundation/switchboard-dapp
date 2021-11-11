import { TestBed } from '@angular/core/testing';

import { DidRegistryFacadeService } from './did-registry-facade.service';

describe('DidRegistryFacadeService', () => {
  let service: DidRegistryFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DidRegistryFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
