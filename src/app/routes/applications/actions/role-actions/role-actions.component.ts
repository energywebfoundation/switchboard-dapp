import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewType } from '../../new-organization/new-organization.component';
import { MatDialog } from '@angular/material/dialog';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { IRole } from 'iam-client-lib';
import { ActionBaseAbstract } from '../action-base.abstract';
import { DomainUtils } from '@utils';

@Component({
  selector: 'app-role-actions',
  templateUrl: './role-actions.component.html',
  styleUrls: ['./role-actions.component.scss'],
})
export class RoleActionsComponent extends ActionBaseAbstract implements OnInit {
  @Input() role: IRole;
  @Output() edited = new EventEmitter();
  deleteConfirmed;
  enrolmentUrl: string;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  ngOnInit(): void {
    this.generateEnrolmentUrl();
  }

  edit() {
    this.showEditComponent(NewRoleComponent, {
      viewType: ViewType.UPDATE,
      origData: this.role,
    });
  }

  private generateEnrolmentUrl(): void {
    if (this.role?.definition?.roleType) {
      this.enrolmentUrl = this.constructEnrolmentUrl(
        this.role.definition.roleType,
        this.role
      );
    }
  }

  private constructEnrolmentUrl(
    listType: string,
    roleDefinition: IRole
  ): string {
    const name = roleDefinition.name;
    const namespace = DomainUtils.getParentNamespace(roleDefinition.namespace);

    return `${location.origin}/enrol?${listType}=${namespace}&roleName=${name}`;
  }
}
