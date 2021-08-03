import { Component, Input, OnInit } from '@angular/core';
import { ViewType } from '../../new-organization/new-organization.component';
import { MatDialog } from '@angular/material/dialog';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ActionBaseAbstract } from '../action-base.abstract';

@Component({
  selector: 'app-role-actions',
  templateUrl: './role-actions.component.html',
  styleUrls: ['./role-actions.component.scss']
})
export class RoleActionsComponent extends ActionBaseAbstract implements OnInit {
  @Input() element;
  enrolmentUrl: string;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  ngOnInit(): void {
    this.generateEnrolmentUrl();
  }

  edit() {
    this.showEditComponent()
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',
      data: {
        viewType: ViewType.UPDATE,
        origData: this.element
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.edited.emit();
        }
      });
  }

  private generateEnrolmentUrl(): void {
    if (this.element) {
      this.enrolmentUrl = this.constructEnrolmentUrl(this.element.definition.roleType, this.element);
    }
  }

  private constructEnrolmentUrl(listType: string, roleDefinition: any) {
    const name = roleDefinition.name;
    const arr = roleDefinition.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
    let namespace = '';

    if (arr.length > 1) {
      namespace = arr[1];
    }

    return `${location.origin}/enrol?${listType}=${namespace}&roleName=${name}`;
  }
}
