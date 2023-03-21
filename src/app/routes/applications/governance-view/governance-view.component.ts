import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

const ListType = {
  ORG: 'org',
  APP: 'app',
  ROLE: 'role',
};

@Component({
  selector: 'app-governance-view',
  templateUrl: './governance-view.component.html',
  styleUrls: ['./governance-view.component.scss'],
})
export class GovernanceViewComponent implements OnInit {
  typeLabel: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

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
  }
}
