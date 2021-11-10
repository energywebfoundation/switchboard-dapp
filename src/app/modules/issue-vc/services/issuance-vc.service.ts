import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {

  constructor(private iamService: IamService) {
  }

  create(data: { subject: string, claim: any }) {
    return this.iamService.issueClaim(data);
  }

  getIssuerRoles() {
    return this.iamService.wrapWithLoadingService(this.iamService.domainsService.getAllowedRolesByIssuer(this.iamService.signerService.did));
  }
}
