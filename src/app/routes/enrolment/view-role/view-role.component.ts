import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit {

  displayedColumns: string[] = ['type', 'label', 'validation'];
  dataSource: RolesFields[] = FIELD_DATA;

  constructor(public dialogRef: MatDialogRef<ViewRoleComponent>) { }

  ngOnInit() {
  }

}

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
}

const FIELD_DATA: RolesFields[] = [
  {type: 'Date', label: 'My Label', validation: 'maxLength:30'},

];
