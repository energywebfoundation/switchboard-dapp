import { Component } from '@angular/core';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent {

  displayedColumns: string[] = ['type', 'label', 'validation'];
  dataSource: RolesFields[] = FIELD_DATA;
}

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
}

const FIELD_DATA: RolesFields[] = [
  {type: 'Date', label: 'My Label', validation: 'maxLength:30'},
];
