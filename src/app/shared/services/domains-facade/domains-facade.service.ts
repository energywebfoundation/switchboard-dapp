import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { SearchType } from 'iam-client-lib';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomainsFacadeService {
  constructor(private iamService: IamService) {}

  get domainsService() {
    return this.iamService.domainsService;
  }

  getENSTypesByOwner(data) {
    return this.domainsService.getENSTypesByOwner(data);
  }

  async checkExistenceOfDomain(domain: string): Promise<boolean> {
    return await this.domainsService.checkExistenceOfDomain({ domain });
  }

  async isOwner(domain: string): Promise<boolean> {
    return await this.domainsService.isOwner({ domain });
  }

  async getDIDsByRole(role: string): Promise<string[]> {
    return await this.domainsService.getDIDsByRole(role);
  }

  getENSTypesBySearchPhrase(search: string, types?: SearchType[]) {
    return from(this.domainsService.getENSTypesBySearchPhrase(search, types));
  }
}
