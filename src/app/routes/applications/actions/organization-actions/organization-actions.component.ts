import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrganizationComponent, ViewType } from '../../new-organization/new-organization.component';
import { NewApplicationComponent } from '../../new-application/new-application.component';
import { NewRoleComponent } from '../../new-role/new-role.component';
import { ListType } from '../../../../shared/constants/shared-constants';
import { NewStakingPoolComponent } from '../../new-staking-pool/new-staking-pool.component';
import { TransferOwnershipComponent } from '../../transfer-ownership/transfer-ownership.component';
import { ActionBaseAbstract } from '../action-base.abstract';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-organization-actions',
  templateUrl: './organization-actions.component.html',
  styleUrls: ['./organization-actions.component.scss']
})
export class OrganizationActionsComponent extends ActionBaseAbstract implements OnInit {
  @Input() organization;
  @Output() viewRoles = new EventEmitter();
  @Output() viewApps = new EventEmitter();
  @Output() organizationCreated = new EventEmitter();
  @Output() appCreated = new EventEmitter();
  @Output() roleCreated = new EventEmitter();
  @Output() transferred = new EventEmitter();
  @Output() deleteConfirmed = new EventEmitter();
  @Output() edited = new EventEmitter();

  stakingUrl: string;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  ngOnInit() {
    this.generateStakingUrl();
  }

  viewAppsHandler() {
    this.viewApps.emit(this.organization);
  }

  viewRolesHandler() {
    this.viewRoles.emit(this.organization);
  }

  createSubOrganization() {
    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',
      data: {
        viewType: ViewType.NEW,
        parentOrg: JSON.parse(JSON.stringify(this.organization)),
        owner: this.organization.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.organizationCreated.emit(this.organization));
  }

  createApp() {
    const dialogRef = this.dialog.open(NewApplicationComponent, {
      width: '600px',
      data: {
        viewType: ViewType.NEW,
        organizationNamespace: this.organization.namespace,
        owner: this.organization.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.appCreated.emit(this.organization));
  }

  createRole() {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',
      data: {
        viewType: ViewType.NEW,
        namespace: this.organization.namespace,
        listType: ListType.ORG,
        owner: this.organization.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.roleCreated.emit(this.organization));
  }

  openStakingPool(element: any) {
    this.dialog.open(NewStakingPoolComponent, {
      data: element,
      width: '600px',
      maxWidth: '100%',
      disableClose: true
    });
  }

  edit() {
    this.showEditComponent(NewOrganizationComponent, {
      viewType: ViewType.UPDATE,
      origData: this.organization
    });
  }

  transferOwnership(): void {
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px',
      data: {
        namespace: this.organization.namespace,
        type: ListType.ORG,
        owner: this.organization.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => this.transferred.emit(this.organization));
  }

  delete() {
    this.deleteDialog({
      header: 'Remove Organization',
      message: 'Do you wish to continue?'
    });
  }

  private generateStakingUrl() {
    if (this.organization?.namespace) {
      this.stakingUrl = `${location.origin}/staking?org=${this.organization.namespace}`;
    }
  }
}
