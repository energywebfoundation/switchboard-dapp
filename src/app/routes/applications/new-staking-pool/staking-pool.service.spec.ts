import { TestBed } from '@angular/core/testing';

import { StakingPoolService } from './staking-pool.service';

describe('StakingPoolService', () => {
  let service: StakingPoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakingPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
