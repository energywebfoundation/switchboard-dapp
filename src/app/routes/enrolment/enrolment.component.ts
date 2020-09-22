import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewRoleComponent } from './new-role/new-role.component';
import { ViewRequestsComponent } from './view-requests/view-requests.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements OnInit {

    enrollmentRequestsColumns: string[] = ['did', 'roleType', 'namespace', 'metadata', 'actions'];
    dataSourceEnRequests: EnrollmentRquests[] = ENROLLMENT_REQUESTS_DATA;

    myEnrollmentsColumns: string[] = ['roleType', 'namespace', 'metadata', 'actions'];
    dataSourceMyEn: MyEnrollments[] = MY_ENROLLMENTS_DATA;

    roleGovernanceColumns: string[] = ['creationDate', 'roleType', 'roleName', 'ensName'];
    dataSourceRoleGov: EnrollmentRoles[] = ROLE_DATA;

  constructor(public dialog: MatDialog) { }

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

  openViewRequestsComponent(): void {
    const dialogRef = this.dialog.open(ViewRequestsComponent, {
      width: '600px',data:{},
      maxWidth: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

export interface EnrollmentRquests {
  did: string;
  roleType: string;
  namespace: string;
  metadata: string;
  actions: string;
}

const ENROLLMENT_REQUESTS_DATA: EnrollmentRquests[] = [
  {did: 'did', roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
  {did: 'did', roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
  {did: 'did', roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
];

export interface MyEnrollments {
  roleType: string;
  namespace: string;
  metadata: string;
  actions: string;
}

const MY_ENROLLMENTS_DATA: MyEnrollments[] = [
  {roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
  {roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
  {roleType: 'Custom Role', namespace: 'Name', metadata: 'metadata', actions: ''},
];

export interface EnrollmentRoles {
  creationDate: string;
  roleType: string;
  roleName: string;
  ensName: string;
}

const ROLE_DATA: EnrollmentRoles[] = [
  {creationDate: '01/28/2020', roleType: 'Custom Role', roleName: 'Device Owner', ensName: 'device.roles.switchboard.ewc'},
  {creationDate: '02/01/2020', roleType: 'Custom Role', roleName: 'Trader', ensName: 'trader.roles.switchboard.ewc'},
  {creationDate: '03/16/2020', roleType: 'Custome Role', roleName: 'Admin', ensName: 'admin.roles.switchboard.ewc'},

];

