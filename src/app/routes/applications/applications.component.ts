import { Component, OnInit } from '@angular/core';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { MatDialog } from '@angular/material';
import { NewApplicationComponent } from './new-application/new-application.component';
import { NewRoleComponent } from './new-role/new-role.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  organizationsColumns: string[] = ['imageURL', 'orgNameSpace', 'orgName', 'websiteURL', 'actions'];
  dataSourceOrganizations: OrganizationsLists[] = ORGANIZATIONS_DATA;

  roleGovernanceColumns: string[] = ['creationDate', 'roleType', 'roleName', 'ensName', 'actions'];
  dataSourceRoleGov: EnrollmentRoles[] = ROLE_DATA;

  constructor(public dialog: MatDialog) { }

  openNewOrgComponent(): void {
    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openNewAppComponent(): void {
    const dialogRef = this.dialog.open(NewApplicationComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openNewRoleComponent(): void {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

export interface OrganizationsLists {
  imageUrl: string;
  orgNameSpace: string;
  orgName: string;
  websiteURL: string;
  actions: string;
}

const ORGANIZATIONS_DATA: OrganizationsLists[] = [
  {imageUrl: 'https://www.energyweb.org/wp-content/uploads/2019/04/logo-knockout.png', orgNameSpace: 'organization1 namespace', orgName: 'Organization Name 1', websiteURL: 'www.organizations1.com', actions: ''},
  {imageUrl: 'https://www.energyweb.org/wp-content/uploads/2019/04/logo-knockout.png', orgNameSpace: 'organization2 namespace', orgName: 'Organization Name 2', websiteURL: 'www.organizations2.com', actions: ''},
  {imageUrl: 'https://www.energyweb.org/wp-content/uploads/2019/04/logo-knockout.png', orgNameSpace: 'organization3 namespace', orgName: 'Organization Name 3', websiteURL: 'www.organizations3.com', actions: ''},
];

export interface EnrollmentRoles {
  creationDate: string;
  roleType: string;
  roleName: string;
  ensName: string;
  actions: string;
}

const ROLE_DATA: EnrollmentRoles[] = [
  {creationDate: '01/28/2020', roleType: 'Custom Role', roleName: 'Device Owner', ensName: 'device.roles.switchboard.ewc', actions: ''},
  {creationDate: '02/01/2020', roleType: 'Custom Role', roleName: 'Trader', ensName: 'trader.roles.switchboard.ewc', actions: ''},
  {creationDate: '03/16/2020', roleType: 'Custome Role', roleName: 'Admin', ensName: 'admin.roles.switchboard.ewc', actions: ''},

];
