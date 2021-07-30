import { Injectable } from '@angular/core';
import { StakingPool, StakingPoolService } from 'iam-client-lib';
import { IamService } from '../iam.service';

@Injectable({
  providedIn: 'root'
})
export class StakingService {
  private stakingPoolService: StakingPoolService;
  private pool: StakingPool;
  constructor(private iamService: IamService) { }

  async init() {
    this.stakingPoolService = await StakingPoolService.init(this.iamService.iam.getSigner());
    return Boolean(this.stakingPoolService);
  }

  async createPool(org: string) {
    this.pool = await this.stakingPoolService.getPool(org);
    return this.pool;
  }

  getStakingPoolService() {
    return this.stakingPoolService;
  }

  getPool(): StakingPool {
    return this.pool;
  }
}
