import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';

@Injectable({
  providedIn: 'root'
})
export class DomainsFacadeService {

  constructor(private iamService: IamService) {
  }

  getENSTypesByOwner(data) {
    return this.iamService.domainsService.getENSTypesByOwner(data);
  }
}
