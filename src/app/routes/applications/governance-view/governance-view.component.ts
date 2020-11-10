import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/layout/header/dialog-user/dialog-user-data';
import { RoleType } from '../new-role/new-role.component';

const ListType = {
  ORG: 'org',
  APP: 'app',
  ROLE: 'role'
};

@Component({
  selector: 'app-governance-view',
  templateUrl: './governance-view.component.html',
  styleUrls: ['./governance-view.component.scss']
})
export class GovernanceViewComponent implements OnInit {
  typeLabel : string;
  formData  : any;
  ListType  = ListType;
  RoleType  = RoleType;
  
  displayedColumnsView: string[] = ['type', 'label', 'validation'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    switch (this.data.type) {
      case ListType.ORG:
        this.typeLabel = 'Organization';
        break;
      case ListType.APP:
        this.typeLabel = 'Application';
        break;
      case ListType.ROLE:
        this.typeLabel = 'Role';
        break;
    }

    this.formData = this.data.definition;
    if (this.formData.definition.others) {
      let tmp = {};
      for (let item of this.formData.definition.others) {
        tmp[item.key] = item.value;
      }
      this.formData.definition.others = JSON.stringify(tmp);
    }
    console.log('formData', this.formData);
  }

}
