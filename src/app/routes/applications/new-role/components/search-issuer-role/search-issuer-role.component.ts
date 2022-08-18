import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoleStepType } from '../../models/role-step.type';
import { NamespaceType } from 'iam-client-lib';

@Component({
  selector: 'app-search-issuer-role',
  templateUrl: './search-issuer-role.component.html',
  styleUrls: ['./search-issuer-role.component.scss'],
})
export class SearchIssuerRoleComponent {
  @Input() type: RoleStepType;
  @Input() role: FormControl;

  get searchPlaceholder() {
    return `Example:issuerrole.${NamespaceType.Role}.myorg.iam.ewc`;
  }
}
