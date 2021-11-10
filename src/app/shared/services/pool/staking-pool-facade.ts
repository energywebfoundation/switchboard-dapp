import { Injectable } from '@angular/core';
import { StakingPool } from 'iam-client-lib';
import { BigNumber } from 'ethers';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StakingPoolFacade {
  private pool: StakingPool;

  isPoolDefined(): boolean {
    return Boolean(this.pool);
  }

  setPool(pool: StakingPool) {
    this.pool = pool;
  }

  putStake(stake: BigNumber | number) {
    return from(this.pool.putStake(stake));
  }

  requestWithdrawDelay() {
    return from(this.pool.requestWithdrawDelay());
  }

  checkReward() {
    return from(this.pool.checkReward());
  }

  getStake(patron?: string) {
    return from(this.pool.getStake(patron));
  }

  requestWithdraw() {
    return from(this.pool.requestWithdraw());
  };

  withdrawalDelay() {
    return from(this.pool.withdrawalDelay());
  }

  withdraw() {
    return from(this.pool.withdraw());
  }
}
