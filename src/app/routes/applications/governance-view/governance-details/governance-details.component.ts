import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ENSNamespaceTypes, PreconditionTypes } from 'iam-client-lib';
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
  @Input('requestedClaims') requestedClaims: any[];

  data: any;

  ListType = ListType;
  RoleType = RoleType;

  typeLabel: string;
  formData: any;
  displayedColumnsView: string[] = ['type', 'label', 'required', 'minLength', 'maxLength', 'pattern', 'minValue', 'maxValue', 'minDate', 'maxDate'];

  appList: any[];
  roleList: any[];

  preconditions = {};
  PreconditionTypes = PreconditionTypes;

  constructor(
    private iamService: IamService,
    private loadingService: LoadingService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.data = this.origData;
    this.setData(this.data);
  }

  public async setData(data: any) {
    this.data = data;

    this.formData = JSON.parse(JSON.stringify(this.data.definition));
    if (this.formData.definition.others) {
      this.formData.definition.others = JSON.stringify(this.formData.definition.others);
    }

    switch (this.data.type) {
      case ListType.ORG:
        this.typeLabel = 'Organization';
        break;
      case ListType.APP:
        this.typeLabel = 'Application';
        break;
      case ListType.ROLE:
        this.typeLabel = 'Role';
        this._initFields();
        break;
    }

    if (this.isEmbedded) {
      await this._getAppsAndRoles();
    }
  }

  private _initFields() {
    if (this.formData.definition.fields) {
      // Init Fields
      for (let data of this.formData.definition.fields) {
        if (data.fieldType === 'date') {
          if (data.maxDate) {
            data.maxDate = new Date(data.maxDate);
          }
          if (data.minDate) {
            data.minDate = new Date(data.minDate);
          }
        }
      }
    }

    if (this.formData.definition.enrolmentPreconditions) {
      // Init Preconditions
      for (let precondition of this.formData.definition.enrolmentPreconditions) {
        if (precondition.conditions) {
          this.preconditions[precondition.type] = precondition.conditions;
        }
      }
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
    if (this.roleList && this.roleList.length) {
      this.roleList.forEach((item: any) => {
        item['isEnrolled'] = this._isEnrolledNamespace(item.namespace);
      });
    }

    // console.log('appList', this.appList);
    // console.log('roleList', this.roleList);
    this.loadingService.hide();
  }

  private _isEnrolledNamespace(namespace: string) {
    let retVal = false;
    if (namespace && this.requestedClaims && this.requestedClaims.length) {
      retVal = this.requestedClaims.some((value: any) => {
        return value.claimType === namespace;
      });
    }
    return retVal;
  }

  viewDetails(data: any, type: string) {
    const dialogRef = this.dialog.open(GovernanceViewComponent, {
      width: '600px',
      data: {
        type: type,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  getQueryParams(listType: string, roleDefinition: any) {
    let name = roleDefinition.name;
    let arr = roleDefinition.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
    let namespace = '';

    if (arr.length > 1) {
      namespace = arr[1];
    }

    let retVal = {
      roleName: name,
      stayLoggedIn: true
    };
    retVal[listType] = namespace;

    return retVal;
  }
}
