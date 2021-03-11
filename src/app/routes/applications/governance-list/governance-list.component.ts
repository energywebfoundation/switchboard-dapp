import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ENSNamespaceTypes, IApp, IOrganization, IRole } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { ConfigService } from 'src/app/shared/services/config.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { NewApplicationComponent } from '../new-application/new-application.component';
import { NewOrganizationComponent, ViewType } from '../new-organization/new-organization.component';
import { NewRoleComponent, RoleType } from '../new-role/new-role.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { TransferOwnershipComponent } from '../transfer-ownership/transfer-ownership.component';

const OrgColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const AppColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const RoleColumns: string[] = ['name', 'type', 'namespace', 'actions'];

const ALLOW_NO_SUBORG = true;
const MAX_TOOLTIP_SUBORG_ITEMS = 5;

@Component({
  selector: 'app-governance-list',
  templateUrl: './governance-list.component.html',
  styleUrls: ['./governance-list.component.scss']
})
export class GovernanceListComponent implements OnInit {
  @Input('list-type') listType: string;
  @Input('isFilterShown') isFilterShown: boolean;
  @Input() defaultFilterOptions: any;
  @Output() updateFilter = new EventEmitter<any>();

  ListType        = ListType;
  RoleType        = RoleType;
  dataSource      = [];
  origDatasource  = [];
  displayedColumns: string[];
  listTypeLabel   : string;
  ensType         : any;

  filterForm      : FormGroup;

  orgHierarchy    = [];

  DRILL_DOWN_SUBORG = true;
  currentUserEthAddress = undefined;
  
  constructor(private loadingService: LoadingService,
      private iamService: IamService,
      private dialog: MatDialog,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private configService: ConfigService
    ) { 
      this.filterForm = fb.group({
        organization: '',
        application: '',
        role: ''
      });
      this.currentUserEthAddress = this.iamService.accountAddress;
    }

  async ngOnInit() {
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

    await this.getList(this.defaultFilterOptions);
  }

  public async getList(filterOptions?: any, resetList?: boolean) {
    if (this.orgHierarchy.length && !resetList) {
      return;
    }
    this.loadingService.show();

    let $getOrgList = await this.iamService.iam.getENSTypesByOwner({
      type: this.ensType,
      owner: this.iamService.accountAddress,
      excludeSubOrgs: false
    });

    type Domain = IRole & IOrganization & IApp;

    let orgList = await Promise.all(
      ($getOrgList as Domain[]).map(async (org) => {
        const isOwnedByCurrentUser = await this.iamService.iam.isOwner({ domain: org.namespace });
        return { ...org, isOwnedByCurrentUser };
      }));

    if (this.listType === ListType.ORG) {
      // Retrieve only main orgs
      orgList = this._getMainOrgs(orgList);
    }
    this.origDatasource = orgList;

    // Setup Filter
    if (filterOptions) {
      this.filterForm.patchValue({ 
        organization: filterOptions.organization || '',
        application: filterOptions.application || '',
        role: ''
      });
    }
    this.filter();
    this.loadingService.hide();
  }

  private _getMainOrgs($getOrgList: any[]) {
    let list = [];
    let subList = [];

    // Separate Parent & Child Orgs
    $getOrgList.forEach((item: any) => {
      let namespaceArr = item.namespace.split('.');
      if (namespaceArr.length === 3) {
        list.push(item);
      }
      else {
        if (!subList[namespaceArr.length - 4]) {
          subList[namespaceArr.length - 4] = [];
        }
        subList[namespaceArr.length - 4].push(item);
      }
    });

    // Remove Unnecessary Sub-Orgs from Main List
    if (list.length || subList.length) {
      for (let i = 0; i < subList.length; i++) {
        let arr = subList[i];
        if (arr && arr.length) {
          for (let subOrg of arr) {
            let exists = false;
            for (let mainOrg of list) {
              if (subOrg.namespace && subOrg.namespace.includes(mainOrg.namespace)) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              list.push(subOrg);
            }
          }
        }
      }
    }

    return list;
  }

  view(type: string, data: any) {
    const dialogRef = this.dialog.open(GovernanceViewComponent, {
      width: '600px',data:{
        type: type,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  viewApps(type: string, data: any) {
    this.updateFilter.emit({
      listType: ListType.APP,
      organization: data.namespace.split('.iam.ewc')[0]
    });
  }

  viewRoles(type: string, data: any) {
    let org = undefined;
    let app = undefined;

    if (type === ListType.ORG) {
      org = data.namespace.split('.iam.ewc')[0];
    }
    else {
      let arr = data.namespace.split('.iam.ewc');
      arr = arr[0].split(ENSNamespaceTypes.Roles);
      arr = arr[arr.length - 1].split(ENSNamespaceTypes.Application);
      org = arr[arr.length - 1];

      if (org.indexOf('.') === 0) {
        org = (org as string).substr(1);
      }
    }

    if (type === ListType.APP) {
      app = data.namespace.split(`.${ENSNamespaceTypes.Application}.`)[0];
    }

    this.updateFilter.emit({
      listType: ListType.ROLE,
      organization: org,
      application: app
    });
  }

  edit(type: string, data: any) {
    let component = undefined;

    switch (type) {
      case ListType.ORG:
        component = NewOrganizationComponent;
        break;
      case ListType.APP:
        component = NewApplicationComponent;
        break;
      case ListType.ROLE:
        component = NewRoleComponent;
        break;
    }

    if (component) {
      const dialogRef = this.dialog.open(component, {
        width: '600px',data:{
          viewType: ViewType.UPDATE,
          origData: data
        },
        maxWidth: '100%',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(async (res: any) => {
        if (res) {
          if (this.orgHierarchy.length) {
            await this.viewSubOrgs(this.orgHierarchy.pop());
          }
          else {
            await this.getList();
          }
        }
      });
    }
  }

  transferOwnership(type: any, data: any) {
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px',data:{
        namespace: data.namespace,
        type: type,
        owner: data.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async result => {

      if (result) {
        if (this.orgHierarchy.length) {
          let currentOrg = this.orgHierarchy.pop();
          if (this.dataSource.length === 1) {
            await this.viewSubOrgs(this.orgHierarchy.pop());
          }
          else {
            await this.viewSubOrgs(currentOrg);
          }
        }
        else {
          await this.getList();
        }
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

  async remove(listType: string, roleDefinition: any) {
    // Make sure that user confirms the removal of this namespace
    let isConfirmed = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: 'Remove ' + (listType === ListType.APP ? 'Application' : 'Organization'),
        message: 'Do you wish to continue?'
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();

    if (await isConfirmed) {
      // Get Removal Steps
      let steps = await this.getRemovalSteps(listType, roleDefinition);

      if (steps) {
        // Launch Remove Org / App Dialog
        let isRemoved = this.dialog.open(RemoveOrgAppComponent, {
          width: '600px',data:{
            namespace: roleDefinition.namespace,
            listType: listType,
            steps: steps
          },
          maxWidth: '100%',
          disableClose: true
        }).afterClosed().toPromise();

        // Refresh the list after successful removal
        if (await isRemoved) {
          if (this.orgHierarchy.length) {
            let currentOrg = this.orgHierarchy.pop();
            if (this.dataSource.length === 1) {
              await this.viewSubOrgs(this.orgHierarchy.pop());
            }
            else {
              await this.viewSubOrgs(currentOrg);
            }
          }
          else {
            await this.getList();
          }
        }
      }
    }
  }

  async newApp(parentOrg: any) {
    const dialogRef = this.dialog.open(NewApplicationComponent, {
      width: '600px',data:{
        viewType: ViewType.NEW,
        organizationNamespace: parentOrg.namespace,
        owner: parentOrg.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (res) {
        // Redirect to Application List
        this.viewApps(ListType.ORG, parentOrg);
      }
    });
  }

  async newRole(listType: string, roleDefinition: any) {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',data:{
        viewType: ViewType.NEW,
        namespace: roleDefinition.namespace,
        listType: listType,
        owner: roleDefinition.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (res) {
        // Redirect to Role List
        this.viewRoles(listType, roleDefinition);
      }
    });
  }

  private async getRemovalSteps(listType: string, roleDefinition: any) {
    this.loadingService.show();
    const returnSteps = this.iamService.iam.address === roleDefinition.owner;
    const call = listType === ListType.ORG ?
      this.iamService.iam.deleteOrganization({
        namespace: roleDefinition.namespace,
        returnSteps
      }) :
      this.iamService.iam.deleteApplication({
        namespace: roleDefinition.namespace,
        returnSteps
      });
    try {
      return returnSteps ?
        await call :
        [{
          info: 'Confirm removal in your safe wallet',
          next: async () => await call
        }];
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e, 'Delete ' + (this.listType === ListType.ORG ? 'Organization' : 'Application'));
    }
    finally {
      this.loadingService.hide();
    }
  }

  filter() {
    let tmpData = JSON.parse(JSON.stringify(this.origDatasource));
    
    // Trim Filters
    this.filterForm.get('organization').setValue(this.filterForm.value.organization.trim());
    this.filterForm.get('application').setValue(this.filterForm.value.application.trim());
    this.filterForm.get('role').setValue(this.filterForm.value.role.trim());

    // Filter By Org
    if (this.filterForm.value.organization) {
      tmpData = tmpData.filter((item: any) => {
        let arr = item.namespace.split('.iam.ewc');
        arr = arr[0].split(ENSNamespaceTypes.Roles);
        arr = arr[arr.length - 1].split(ENSNamespaceTypes.Application);

        let org = arr[arr.length - 1];
        return (org.toUpperCase().indexOf(this.filterForm.value.organization.toUpperCase()) >= 0);
      });
    }

    // Filter By App
    if (this.filterForm.value.application) {
      tmpData = tmpData.filter((item: any) => {
        let arr = item.namespace.split(`.${ENSNamespaceTypes.Application}.`);
        arr = arr[0].split('.');
        return (arr[arr.length - 1].toUpperCase().indexOf(this.filterForm.value.application.toUpperCase()) >= 0);
      });
    }

    // Filter By Role
    if (this.filterForm.value.role) {
      tmpData = tmpData.filter((item: any) => {
        let arr = item.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
        arr = arr[0].split('.');
        return (arr[arr.length - 1].toUpperCase().indexOf(this.filterForm.value.role.toUpperCase()) >= 0);
      });
    }

    this.dataSource = tmpData;
  }

  resetFilter() {
    this.filterForm.patchValue({
      organization: '',
      application: '',
      role: ''
    });

    this.dataSource = JSON.parse(JSON.stringify(this.origDatasource));
  }

  newSubOrg(parentOrg: any, displayMode?: boolean) {
    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',
      data: {
        viewType: ViewType.NEW,
        parentOrg: JSON.parse(JSON.stringify(parentOrg)),
        owner: parentOrg.owner
      },
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (res: any) => {
      if (res) {
        // Refresh Screen
        let currentOrg = displayMode === this.DRILL_DOWN_SUBORG ? parentOrg : this.orgHierarchy.pop();
        await this.viewSubOrgs(currentOrg, ALLOW_NO_SUBORG);
      }
    });
  }

  async viewSubOrgs(element: any, allowNoSubOrg?: boolean) {
    if (element && ((element.subOrgs && element.subOrgs.length) || allowNoSubOrg)) {
      this.loadingService.show();
      try {
        let $getSubOrgs = await this.iamService.iam.getOrgHierarchy({
          namespace: element.namespace
        });

        if ($getSubOrgs.subOrgs && $getSubOrgs.subOrgs.length) {
          this.dataSource = JSON.parse(JSON.stringify($getSubOrgs.subOrgs));
          this.orgHierarchy.push(element);
        }
        else {
          this.toastr.warning('Sub-Organization List is empty.', 'Sub-Organization')
        }
      }
      catch (e) {
        console.error(e);
        this.toastr.error('An error has occured while retrieving the list.', 'Sub-Organization');
      }
      finally {
        this.loadingService.hide();
      }
    }
  }

  async resetOrgList(e: any, idx?: number) {
    e.preventDefault();

    if (idx === undefined) {
      this.dataSource = JSON.parse(JSON.stringify(this.origDatasource));
      this.orgHierarchy.length = 0;
    }
    else {
      let element = this.orgHierarchy[idx];
      this.orgHierarchy.length = idx
      await this.viewSubOrgs(element);
    }
  }

  getTooltip(element: any) {
    let retVal = '';

    if (element.subOrgs && element.subOrgs.length) {
      let count = 0;
      if (element.subOrgs.length > 1) {
        retVal = 'Sub-Organizations \n';
      }
      else {
        retVal = 'Sub-Organization \n';
      }
    
      while (count < MAX_TOOLTIP_SUBORG_ITEMS && count < element.subOrgs.length) {
        retVal += `\n${element.subOrgs[count++].namespace}`;
      }

      if (element.subOrgs.length > MAX_TOOLTIP_SUBORG_ITEMS) {
        retVal += `\n\n ... +${ element.subOrgs.length - MAX_TOOLTIP_SUBORG_ITEMS } More`;
      }
    }

    return retVal;
  }
}
