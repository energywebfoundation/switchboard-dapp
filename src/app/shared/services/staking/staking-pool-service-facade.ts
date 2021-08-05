import { Injectable } from '@angular/core';
import { StakingPoolService } from 'iam-client-lib';
import { IamService } from '../iam.service';
import { StakingPoolFacade } from '../pool/staking-pool-facade';
import { from } from 'rxjs';
import { utils } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class StakingPoolServiceFacade {
  private stakingPoolService: StakingPoolService;

  constructor(private iamService: IamService, private stakingPoolFacade: StakingPoolFacade) {
  }

  async init() {
    this.stakingPoolService = await StakingPoolService.init(this.iamService.iam.getSigner());
    return Boolean(this.stakingPoolService);
  }

  async createPool(org: string) {
    const pool = await this.stakingPoolService.getPool(org);
    this.stakingPoolFacade.setPool(pool);
    return Boolean(pool);
  }

  allServices() {
    return from(this.stakingPoolService.allServices());
  }

  launchStakingPool(pool: {
    org: string;
    minStakingPeriod: number | utils.BigNumber;
    patronRewardPortion: number;
    patronRoles: string[];
    principal: utils.BigNumber;
  }) {
    return from(this.stakingPoolService.launchStakingPool(pool));
  }

}
