import { Injectable } from '@angular/core';
import { StakingPool } from 'iam-client-lib';
import { utils } from 'ethers';
import { TransactionSpeed } from 'iam-client-lib/dist/src/staking';
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

  putStake(stake: utils.BigNumber | number, transactionSpeed?: TransactionSpeed) {
    return from(this.pool.putStake(stake, transactionSpeed));
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

  requestWithdraw(transactionSpeed?: TransactionSpeed) {
    return from(this.pool.requestWithdraw(transactionSpeed));
  };

  withdrawalDelay() {
    return from(this.pool.withdrawalDelay());
  }

  withdraw(transactionSpeed?: TransactionSpeed) {
    return from(this.pool.withdraw(transactionSpeed));
  }
}
