import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { SearchType } from 'iam-client-lib/dist/src/modules/cacheClient/cacheClient.types';

@Injectable({
  providedIn: 'root'
})
export class DomainsFacadeService {

  constructor(private iamService: IamService) {
  }

  get domainsService() {
    return this.iamService.domainsService;
  }

  getENSTypesByOwner(data) {
    return this.domainsService.getENSTypesByOwner(data);
  }

  async checkExistenceOfDomain(domain: string): Promise<boolean> {
    return await this.domainsService.checkExistenceOfDomain({domain});
  }

  async isOwner(domain: string): Promise<boolean> {
    return await this.domainsService.isOwner({domain});
  }

  async getDIDsByRole(role: string): Promise<string[]> {
    return await this.domainsService.getDIDsByRole(role);
  }

  async getENSTypesBySearchPhrase(search: string, types?: SearchType[]) {
    return await this.domainsService.getENSTypesBySearchPhrase(search, types);
  }
}
