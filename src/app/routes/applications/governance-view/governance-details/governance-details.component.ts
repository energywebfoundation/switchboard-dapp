import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NamespaceType, PreconditionType } from 'iam-client-lib';
import { ListType } from '../../../../shared/constants/shared-constants';
import { IamService } from '../../../../shared/services/iam.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { RoleType } from '../../new-role/new-role.component';
import { GovernanceViewComponent } from '../governance-view.component';
import { IssuerType } from '../../new-role/models/issuer-type.enum';

@Component({
  selector: 'app-governance-details',
  templateUrl: './governance-details.component.html',
  styleUrls: ['./governance-details.component.scss']
})
export class GovernanceDetailsComponent {
  @Input() set origData(value: any) {
    this.setData(value);
  }

  @Input() isEmbedded: boolean;
  @Input() requestedClaims: any[];

  data: any;

  ListType = ListType;
  RoleType = RoleType;

  typeLabel: string;
  formData: any;

  appList: any[];
  roleList: any[];

  preconditions = {};
  PreconditionTypes = PreconditionType;
  panelOpenState = false;

  get requestorFields() {
    return this.formData?.definition?.fields;
  }

  get issuerFields() {
    return this.formData?.definition?.issuerFields;
  }

  get isDIDType() {
    return this.issuer?.issuerType === IssuerType.DID;
  }

  get isRoleType() {
    return this.issuer?.issuerType === IssuerType.ROLE;
  }

  get issuer() {
    return this.formData?.definition?.issuer;
  }

  constructor(
    private iamService: IamService,
    private loadingService: LoadingService,
    private dialog: MatDialog) {
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
      for (const data of this.formData.definition.fields) {
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
      for (const precondition of this.formData.definition.enrolmentPreconditions) {
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

    let type = NamespaceType.Application;
    if (this.data.type === ListType.ORG) {
      type = NamespaceType.Organization;
      this.appList = await this.iamService.domainsService.getAppsOfOrg(this.formData.namespace);
    }

    this.roleList = await this.iamService.domainsService.getRolesByNamespace({
      parentType: type,
      namespace: this.formData.namespace
    });
    if (this.roleList && this.roleList.length) {
      this.roleList.forEach((item: any) => {
        item.isEnrolled = this._isEnrolledNamespace(item.namespace);
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
        type,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  getQueryParams(listType: string, roleDefinition: any) {
    const name = roleDefinition.name;
    const arr = roleDefinition.namespace.split(`.${NamespaceType.Role}.`);
    let namespace = '';

    if (arr.length > 1) {
      namespace = arr[1];
    }

    const retVal = {
      roleName: name,
      stayLoggedIn: true
    };
    retVal[listType] = namespace;

    return retVal;
  }
}
