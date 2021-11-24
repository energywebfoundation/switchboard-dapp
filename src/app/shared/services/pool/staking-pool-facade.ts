import { Injectable } from '@angular/core';
import { StakingPoolService } from 'iam-client-lib';
import { BigNumber } from 'ethers';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StakingPoolFacade {
  private pool: StakingPoolService;

  isPoolDefined(): boolean {
    return Boolean(this.pool);
  }

  setPool(pool: StakingPoolService) {
    this.pool = pool;
  }

  putStake(stake: BigNumber | number) {
    return from(this.pool.putStake(stake));
  }

  checkReward() {
    return from(this.pool.checkReward());
  }

  getStake() {
    return from(this.pool.getStake());
  }

  withdraw() {
    return from(this.pool.withdraw());
  }

  getHardCap() {
    return from(this.pool.getHardCap());
  }

  getContributionLimit() {
    return from(this.pool.getContributionLimit());
  }
}
