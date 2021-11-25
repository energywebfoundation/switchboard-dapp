import { TestBed } from '@angular/core/testing';

import { AssetsFacadeService } from './assets-facade.service';

describe('AssetsFacadeService', () => {
  let service: AssetsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
