import { Component, Input } from '@angular/core';
import { ENSPrefixes } from '../../new-role.component';
import { FormControl } from '@angular/forms';
import { RoleStepTypeEnum } from '../../models/role-step-type.enum';

@Component({
  selector: 'app-search-issuer-role',
  templateUrl: './search-issuer-role.component.html',
  styleUrls: ['./search-issuer-role.component.scss'],
})
export class SearchIssuerRoleComponent {
  @Input() type: RoleStepTypeEnum;
  @Input() role: FormControl;

  get searchPlaceholder() {
    return `Example:issuerrole.${ENSPrefixes.Roles}.myorg.iam.ewc`;
  }
}
