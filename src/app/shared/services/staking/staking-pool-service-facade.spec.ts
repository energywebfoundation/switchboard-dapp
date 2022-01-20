import { TestBed } from '@angular/core/testing';
import { StakingPoolServiceFacade } from './staking-pool-service-facade';

xdescribe('StakingService', () => {
  let service: StakingPoolServiceFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakingPoolServiceFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
