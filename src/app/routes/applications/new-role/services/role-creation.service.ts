import { Injectable } from '@angular/core';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';

const TOASTR_HEADER = 'Role Creation';


@Injectable({
  providedIn: 'root'
})
export class RoleCreationService {

  constructor(private domainsFacade: DomainsFacadeService,
              private loadingService: LoadingService,
              private toastrService: SwitchboardToastrService) {
  }

  async checkIfUserCanUseDomain(domain: string): Promise<boolean> {
    this.loadingService.show('Checking existence of Domain...');
    // Check if namespace is taken
    try {
      const exists = await this.domainsFacade.checkExistenceOfDomain(domain);
      if (!exists) {
        return true;
      }
      return await this.domainsFacade.isOwner(domain);
    } catch (e) {
      this.toastrService.error(e?.message, TOASTR_HEADER);
      return false;
    } finally {
      this.loadingService.hide();
    }

  }

}
