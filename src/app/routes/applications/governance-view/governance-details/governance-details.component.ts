import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { type } from 'os';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RoleType } from '../../new-role/new-role.component';
import { GovernanceViewComponent } from '../governance-view.component';

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
  displayedColumnsView: string[] = ['type', 'label'/*, 'validation'*/];

  appList: any[];
  roleList: any[];

  constructor(private iamService: IamService, 
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

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

    this.formData = JSON.parse(JSON.stringify(this.data.definition));
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

  viewDetails(data: any, type: string) {
    const dialogRef = this.dialog.open(GovernanceViewComponent, {
      width: '600px', data:{
        type: type,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  async enrol(type: string, role: any) {
    // check if currently enrolled in this role
    if (!await this._isEnrolled(role)) {
      let url = this._constructEnrolmentUrl(type, role);
      window.open(url, '_blank');
    }
    else {
      this.toastr.warning('You either have an approved/pending enrolment request for this role.', 'Enrolment');
    }
  }

  private async _isEnrolled(role: any): Promise<boolean> {
    let isEnrolled = false;
    let namespaceArr: string[] = role.namespace.split('.');
    namespaceArr.splice(0, 2);

    try {
      this.loadingService.show();
      let enrolledList = await this.iamService.iam.getRequestedClaims({
        did: this.iamService.iam.getDid(),
        parentNamespace: namespaceArr.join('')
      });

      if (enrolledList) {
        for (let i = 0; i < enrolledList.length; i++) {
          if (enrolledList[i].claimType === role.namespace) {
            isEnrolled = true;
            break;
          }
        }
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e);
    }
    finally {
      this.loadingService.hide();
    }

    return isEnrolled;
  }

  private _constructEnrolmentUrl(listType: string,roleDefinition: any) {
    let name = roleDefinition.name;
    let arr = roleDefinition.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
    let namespace = '';

    if (arr.length > 1) {
      namespace = arr[1];
    }

    return `${location.origin}/#/enrol?${listType}=${namespace}&roleName=${name}&stayLoggedIn=true`;
  }
}
