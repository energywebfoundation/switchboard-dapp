import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export const RoleType = {
  org: 'Organization',
  app: 'Application',
  custom: 'Custom'
};

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent {
  public RoleTypes = RoleType;
  public newRoleForm: FormGroup;

  displayedColumns: string[] = ['type', 'label', 'validation', 'actions'];
  dataSource: RolesFields[] = FIELD_DATA;

  constructor(public dialogRef: MatDialogRef<NewRoleComponent>,
      private fb: FormBuilder) {
    this.newRoleForm = fb.group({
      roleType: [null, Validators.required],
      metadata: null,
      roleName: [null, Validators.compose([
        Validators.required, 
        Validators.pattern('^[a-z]*$'), 
        Validators.minLength(3),
        Validators.maxLength(256)
      ])],
      ensName: new FormControl({ value: null, disabled: true}),
      version: null,
      issuer: {
        issuerType: null,
        did: null
      }
    });
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
