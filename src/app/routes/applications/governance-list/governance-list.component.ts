import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RoleType } from '../new-role/new-role.component';
import { TransferOwnershipComponent } from '../transfer-ownership/transfer-ownership.component';

const OrgColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const AppColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const RoleColumns: string[] = ['name', 'type', 'namespace', 'actions'];

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
      private dialog: MatDialog,
      private toastr: ToastrService
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
      owner: this.iamService.accountAddress
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

  transferOwnership(type: any, data: any) {
    console.log('data', data);
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px',data:{
        namespace: data.namespace,
        type: type
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      if (result) {
        this.getList();
      }
    });
  }

  private constructEnrolmentUrl(listType: string,roleDefinition: any) {
    let name = roleDefinition.name;
    let arr = roleDefinition.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
    let namespace = '';

    if (arr.length > 1) {
      namespace = arr[1];
    }

    return `${location.origin}/#/enrol?${listType}=${namespace}&roleName=${name}`;
  }

  copyToClipboard(listType: string, roleDefinition: any) {
    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.constructEnrolmentUrl(listType, roleDefinition));
      e.preventDefault();
    }

    document.addEventListener("copy", listener, false)
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);

    this.toastr.success('Role Enrolment URL is copied to clipboard.');
  }
}
