import { Injectable } from '@angular/core';
import { IRole, NamespaceType } from 'iam-client-lib';
import { IamService } from '../../../../shared/services/iam.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private iamService: IamService) {
  }

  getRoleList(): Observable<IRole[]> {
    return this.iamService.wrapWithLoadingService<IRole[]>(
      this.iamService.getENSTypesByOwner(NamespaceType.Role) as Promise<IRole[]>
    );
  }
}
