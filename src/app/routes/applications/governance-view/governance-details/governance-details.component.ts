import { Component, Input, OnInit } from '@angular/core';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RoleType } from '../../new-role/new-role.component';

@Component({
  selector: 'app-governance-details',
  templateUrl: './governance-details.component.html',
  styleUrls: ['./governance-details.component.scss']
})
export class GovernanceDetailsComponent implements OnInit {
  @Input('data') origData: any;
  @Input('is-embedded') isEmbedded: boolean;

  data: any;

  ListType  = ListType;
  RoleType  = RoleType;

  typeLabel: string;
  formData  : any;
  displayedColumnsView: string[] = ['type', 'label', 'validation'];

  appList: any[];
  roleList: any[];

  constructor(private iamService: IamService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.data = this.origData;
    this.setData(this.data);
  }
  
  public async setData(data: any) {
    this.data = data;
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

    if (this.isEmbedded) {
      await this._getAppsAndRoles();
    }
  }

  private async _getAppsAndRoles() {
    this.loadingService.show();
    
    this.appList = [];
    this.roleList = [];

    let type = ENSNamespaceTypes.Application;
    if (this.data.type === ListType.ORG) {
      type = ENSNamespaceTypes.Organization;
      this.appList = await this.iamService.iam.getAppsByOrgNamespace({
        namespace: this.formData.namespace
      });
    }
    
    this.roleList = await this.iamService.iam.getRolesByNamespace({
      parentType: type,
      namespace: this.formData.namespace
    });

    console.log('appList', this.appList);
    console.log('roleList', this.roleList);
    this.loadingService.hide();
  }

  viewAppDetails(app: any) {

  }

  viewRoleDetails(role: any) {

  }

  enrol(role: any) {

  }
}
