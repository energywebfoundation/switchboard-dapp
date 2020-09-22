import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss']
})
export class ViewRequestsComponent implements OnInit {

  displayedColumns: string[] = ['type', 'label', 'validation', 'actions'];
  dataSource: RolesFields[] = FIELD_DATA;

  constructor(public dialogRef: MatDialogRef<ViewRequestsComponent>) { }

  ngOnInit() {
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
