import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewRoleComponent } from './new-role/new-role.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements OnInit {

    displayedColumns: string[] = ['creationDate', 'roleType', 'roleName', 'ensName'];
    dataSource: EnrolmentRoles[] = ROLE_DATA;

  constructor(public dialog: MatDialog) { }

  openNewRoleComponent(): void {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '560px',data:{},
      maxWidth: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}

export interface EnrolmentRoles {
  creationDate: string;
  roleType: string;
  roleName: string;
  ensName: string;
}

const ROLE_DATA: EnrolmentRoles[] = [
  {creationDate: '01/28/2020', roleType: 'Custom Role', roleName: 'Device Owner', ensName: 'device.roles.switchboard.ewc'},
  {creationDate: '02/01/2020', roleType: 'Custom Role', roleName: 'Trader', ensName: 'trader.roles.switchboard.ewc'},
  {creationDate: '03/16/2020', roleType: 'Custome Role', roleName: 'Admin', ensName: 'admin.roles.switchboard.ewc'},

];
