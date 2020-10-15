import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RoleType } from '../new-role/new-role.component';

const OrgColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const AppColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const RoleColumns: string[] = ['type', 'namespace', 'actions'];

const ListType = {
  ORG: 'org',
  APP: 'app',
  ROLE: 'role'
};

@Component({
  selector: 'app-governance-list',
  templateUrl: './governance-list.component.html',
  styleUrls: ['./governance-list.component.scss']
})
export class GovernanceListComponent implements OnInit {
  @Input('list-type') listType: string;

  ListType        = ListType;
  RoleType        = RoleType;
  dataSource      = [];
  displayedColumns: string[];
  listTypeLabel   : string;
  ensType         : any;
  
  constructor(private loadingService: LoadingService,
      private iamService: IamService,
      private dialog: MatDialog
    ) { }

  async ngOnInit() {
    console.log('listType', this.listType);
    switch (this.listType) {
      case ListType.ORG:
        this.displayedColumns = OrgColumns;
        this.listTypeLabel = 'Organization';
        this.ensType = ENSNamespaceTypes.Organization;
        break;
      case ListType.APP:
        this.displayedColumns = AppColumns;
        this.listTypeLabel = 'Application';
        this.ensType = ENSNamespaceTypes.Application;
        break;
      case ListType.ROLE:
        this.displayedColumns = RoleColumns;
        this.listTypeLabel = 'Role';
        this.ensType = ENSNamespaceTypes.Roles;
        break;
    }

    await this.getList();
  }

  public async getList() {
    this.loadingService.show();
    const $getOrgList = await this.iamService.iam.getENSTypesByOwner({
      type: this.ensType,
      owner: this.iamService.user['accountAddress']
    });

    this.dataSource = $getOrgList;
    console.log($getOrgList);
    this.loadingService.hide();
  }

  view(type: string, data: any) {
    console.log('type', type);
    console.log('data', data);
    const dialogRef = this.dialog.open(GovernanceViewComponent, {
      width: '600px',data:{
        type: type,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }
}
