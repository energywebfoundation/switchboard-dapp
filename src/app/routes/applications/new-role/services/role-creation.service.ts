import { Injectable } from '@angular/core';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { NamespaceType } from 'iam-client-lib';
import { IssuerType } from '../models/issuer-type.enum';
import { RoleStepType } from '../models/role-step.type';
import { DomainUtils } from '../../../../utils/functions/domain-utils/domain-utils';

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
      if (exists) {
        return false;
      }

      return await this.domainsFacade.isOwner(
        DomainUtils.getRoleNamespace(domain)
      );
    } catch (e) {
      this.toastrService.error(e?.message, TOASTR_HEADER);
      return false;
    }
  }

  async isListOrRoleNameValid(
    selectionType: IssuerType,
    roleName: string,
    list: string[],
    type: RoleStepType = 'Issuer'
  ): Promise<boolean> {
    if (IssuerType.DID === selectionType && !list.length) {
      this.toastrService.error(`${type} list is empty.`, TOASTR_HEADER);
      return false;
    }

    if (IssuerType.ROLE === selectionType && !roleName) {
      this.toastrService.error(`${type} Role is empty.`, TOASTR_HEADER);
      return false;
    }

    if (IssuerType.ROLE === selectionType) {
      // Check if rolename exists or valid
      const exists = await this.domainsFacade.checkExistenceOfDomain(roleName);

      if (!exists || !roleName.includes(`.${NamespaceType.Role}.`)) {
        this.toastrService.error(
          `${type} Role Namespace does not exist or is invalid.`,
          TOASTR_HEADER
        );
        return false;
      }
    }

    return true;
  }
}
