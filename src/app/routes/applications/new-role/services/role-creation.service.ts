import { Injectable } from '@angular/core';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { NamespaceType } from 'iam-client-lib';
import { IssuerType } from '../models/issuer-type.enum';

const TOASTR_HEADER = 'Role Creation';

@Injectable({
  providedIn: 'root',
})
export class RoleCreationService {
  constructor(
    private domainsFacade: DomainsFacadeService,
    private loadingService: LoadingService,
    private toastrService: SwitchboardToastrService
  ) {}

  async canUseDomain(domain: string): Promise<boolean> {
    try {
      const exists = await this.domainsFacade.checkExistenceOfDomain(domain);
      if (!exists) {
        return true;
      }
      return await this.domainsFacade.isOwner(domain);
    } catch (e) {
      this.toastrService.error(e?.message, TOASTR_HEADER);
      return false;
    }
  }

  async areIssuersValid(
    issuerType: IssuerType,
    issuerRoleName: string,
    issuerList: string[]
  ): Promise<boolean> {
    if (IssuerType.DID === issuerType && !issuerList.length) {
      this.toastrService.error('Issuer list is empty.', TOASTR_HEADER);
      return false;
    }

    if (IssuerType.ROLE === issuerType && !issuerRoleName) {
      this.toastrService.error('Issuer Role is empty.', TOASTR_HEADER);
      return false;
    }

    if (IssuerType.ROLE === issuerType) {
      // Check if rolename exists or valid
      const exists = await this.domainsFacade.checkExistenceOfDomain(
        issuerRoleName
      );

      if (!exists || !issuerRoleName.includes(`.${NamespaceType.Role}.`)) {
        this.toastrService.error(
          'Issuer Role Namespace does not exist or is invalid.',
          TOASTR_HEADER
        );
        return false;
      }
    }

    return true;
  }
}
