import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ViewType } from '../../new-organization/new-organization.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import { MatDialog } from '@angular/material/dialog';
import { NewApplicationComponent } from '../../new-application/new-application.component';
import { ActionBaseAbstract } from '../action-base.abstract';

@Component({
  selector: 'app-application-actions',
  templateUrl: './application-actions.component.html',
  styleUrls: ['./application-actions.component.scss']
})
export class ApplicationActionsComponent extends ActionBaseAbstract {
  @Input() element;
  @Output() viewRoles = new EventEmitter();
  @Output() deleteConfirmed = new EventEmitter();
  @Output() edited = new EventEmitter();

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  viewRolesHandler() {
    this.viewRoles.emit(this.element);
  }

  createRole() {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',
      data: {
        viewType: ViewType.NEW,
        namespace: this.element.namespace,
        listType: ListType.APP,
        owner: this.element.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe(async (res: any) => {
        if (res) {
          this.viewRoles.emit(this.element);
        }
      });
  }

  edit() {
    this.showEditComponent(NewApplicationComponent, {
      viewType: ViewType.UPDATE,
      origData: this.element
    });
  }

  delete() {
    this.deleteDialog({
      header: 'Remove Application',
      message: 'Do you wish to continue?'
    });
  }

}
