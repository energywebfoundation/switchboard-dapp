import { Injectable } from '@angular/core';
import { NamespaceType } from 'iam-client-lib';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DomainsFacadeService } from '../../../../shared/services/domains-facade/domains-facade.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationCreationService {
  constructor(
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService,
    private domainsFacade: DomainsFacadeService
  ) {}

  async isOrganizationNamespaceAvailable(
    namespace: string,
    header?: string
  ): Promise<boolean> {
    if (namespace) {
      try {
        this.loadingService.show();

        // Check if organization namespace exists
        let exists = await this.domainsFacade.checkExistenceOfDomain(namespace);

        if (exists) {
          // Check if application sub-domain exists in this organization
          exists = await this.domainsFacade.checkExistenceOfDomain(
            `${NamespaceType.Application}.${namespace}`
          );

          if (exists) {
            // check if user is authorized to create an app under the application namespace
            const isOwner = await this.domainsFacade.isOwner(namespace);

            if (!isOwner) {
              this.toastr.error(
                'You are not authorized to create an application in this organization.',
                header
              );
              return false;
            }
          } else {
            this.toastr.error(
              'Application subdomain in this organization does not exist.',
              header
            );
            return false;
          }
        } else {
          this.toastr.error('Organization namespace does not exist.', header);
          return false;
        }
      } catch (e) {
        this.toastr.error(e.message, 'System Error');
        return false;
      } finally {
        this.loadingService.hide();
      }
    } else {
      this.toastr.error('Organization Namespace is missing.', header);
      return false;
    }

    return true;
  }
}
