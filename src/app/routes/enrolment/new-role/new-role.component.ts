import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent {

  displayedColumns: string[] = ['type', 'label', 'validation', 'actions'];
  dataSource: RolesFields[] = FIELD_DATA;

  constructor(public dialogRef: MatDialogRef<NewRoleComponent>) {
   }


}

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
  actions: string;
}

const FIELD_DATA: RolesFields[] = [
  {type: 'Date', label: 'My Label', validation: 'maxLength:30', actions: ''},

];
