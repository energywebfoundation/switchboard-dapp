import { TestBed } from '@angular/core/testing';

import { AssetListService } from './asset-list.service';

describe('AssetListService', () => {
  let service: AssetListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
