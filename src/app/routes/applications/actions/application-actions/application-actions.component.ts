import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ViewType } from '../../new-organization/new-organization.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import { MatDialog } from '@angular/material/dialog';
import { NewApplicationComponent } from '../../new-application/new-application.component';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-application-actions',
  templateUrl: './application-actions.component.html',
  styleUrls: ['./application-actions.component.scss']
})
export class ApplicationActionsComponent {
  @Input() element;
  @Output() viewRoles = new EventEmitter();
  @Output() edited = new EventEmitter();
  @Output() deleteConfirmed = new EventEmitter();

  constructor(private dialog: MatDialog) {
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
    const dialogRef = this.dialog.open(NewApplicationComponent, {
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

  delete() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: 'Remove Organization',
        message: 'Do you wish to continue?'
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      if (res) {
        this.deleteConfirmed.emit();
      }
    });
  }

}
