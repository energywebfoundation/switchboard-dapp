import { TestBed } from '@angular/core/testing';
import { StakingPoolFacade } from './staking-pool-facade';


describe('PoolService', () => {
  let service: StakingPoolFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakingPoolFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
