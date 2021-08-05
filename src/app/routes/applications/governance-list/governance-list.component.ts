import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ENSNamespaceTypes, IOrganization } from 'iam-client-lib';
import { Subject } from 'rxjs';

import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RoleType } from '../new-role/new-role.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { StakingService } from '../../../shared/services/staking/staking.service';

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
export class GovernanceListComponent implements OnInit, OnDestroy {
  @Input() listType: string;
  @Input() isFilterShown: boolean;
  @Input() defaultFilterOptions: any;
  @Output() updateFilter = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  ListType = ListType;
  RoleType = RoleType;
  dataSource = new MatTableDataSource([]);
  origDatasource = [];
  displayedColumns: string[];
  listTypeLabel: string;
  ensType: any;

  filterForm = this.fb.group({
    organization: '',
    application: '',
    role: ''
  });

  orgHierarchy = [];

  currentUserEthAddress = this.iamService.accountAddress;

  private _isSubOrgCreated = false;
  private subscription$ = new Subject();

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private toastr: SwitchboardToastrService,
              private stakingService: StakingService) {
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

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {

        switch (this.listType) {
          case ListType.ORG:
            return item.definition.orgName.toLowerCase();
          case ListType.APP:
            return item.definition.appName.toLowerCase();
          case ListType.ROLE:
            return item.definition.roleName.toLowerCase();
        }
      } else if (property === 'type') {
        return item.definition.roleType;
      } else {
        return item[property];
      }
    };

    await this.getList(this.defaultFilterOptions);
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public async getList(filterOptions?: any, resetList?: boolean) {
    if (this.orgHierarchy.length && !resetList) {
      return;
    }
    this.loadingService.show();

    let orgList = await this.iamService.iam.getENSTypesByOwner({
      type: this.ensType,
      owner: this.iamService.accountAddress,
      excludeSubOrgs: false
    });

    if (this.listType === ListType.ORG) {
      let services = await this.stakingService.getStakingPoolService().allServices();
      const servicesNames = services.map((service) => service.org);
      const listWithProvidersInfo = (orgList as IOrganization[]).map((org: IOrganization) => ({...org, isProvider: servicesNames.includes(org.namespace)}))
      // Retrieve only main orgs
      orgList = this._getMainOrgs(listWithProvidersInfo);
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
    const list = [];
    const subList = [];

    // Separate Parent & Child Orgs
    $getOrgList.forEach((item: any) => {
      const namespaceArr = item.namespace.split('.');
      if (namespaceArr.length === 3) {
        list.push(item);
      } else {
        if (!subList[namespaceArr.length - 4]) {
          subList[namespaceArr.length - 4] = [];
        }
        subList[namespaceArr.length - 4].push(item);
      }
    });

    // Remove Unnecessary Sub-Orgs from Main List
    if (list.length || subList.length) {
      for (let i = 0; i < subList.length; i++) {
        const arr = subList[i];
        if (arr && arr.length) {
          for (const subOrg of arr) {
            let exists = false;
            for (const mainOrg of list) {
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

  viewDetails(type: string, data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px', data: {
        type,
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
    let org;
    let app;

    if (type === ListType.ORG) {
      org = data.namespace.split('.iam.ewc')[0];
    } else {
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

  async edit() {
    if (this.orgHierarchy.length) {
      await this.viewSubOrgs(this.orgHierarchy.pop());
    } else {
      await this.getList();
    }
  }

  async transferOwnership() {
    if (this.orgHierarchy.length) {
      const currentOrg = this.orgHierarchy.pop();
      if (this.dataSource.data.length === 1) {
        await this.viewSubOrgs(this.orgHierarchy.pop());
      } else {
        await this.viewSubOrgs(currentOrg);
      }
    } else {
      await this.getList();
    }
  }

  async remove(listType: string, roleDefinition: any) {
    // Get Removal Steps
    const steps = await this.getRemovalSteps(listType, roleDefinition);

    if (steps) {
      // Launch Remove Org / App Dialog
      const isRemoved = this.dialog.open(RemoveOrgAppComponent, {
        width: '600px', data: {
          namespace: roleDefinition.namespace,
          listType,
          steps
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().toPromise();

      // Refresh the list after successful removal
      if (await isRemoved) {
        if (this.orgHierarchy.length) {
          const currentOrg = this.orgHierarchy.pop();
          if (this.dataSource.data.length === 1) {
            await this.viewSubOrgs(this.orgHierarchy.pop());
          } else {
            await this.viewSubOrgs(currentOrg);
          }
        } else {
          await this.getList();
        }
      }

    }
  }

  async newApp(parentOrg: any) {
    this.viewApps(ListType.ORG, parentOrg);
  }

  async newRole(listType: string, roleDefinition: any) {
    this.viewRoles(listType, roleDefinition);
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
    } catch (e) {
      console.error(e);
      this.toastr.error(e, 'Delete ' + (this.listType === ListType.ORG ? 'Organization' : 'Application'));
    } finally {
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

        const org = arr[arr.length - 1];
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

    this.dataSource.data = tmpData;
  }

  resetFilter() {
    this.filterForm.patchValue({
      organization: '',
      application: '',
      role: ''
    });

    this.dataSource.data = JSON.parse(JSON.stringify(this.origDatasource));
  }

  async newSubOrg(parentOrg: any) {
    await this.viewSubOrgs(parentOrg, ALLOW_NO_SUBORG);
  }

  async viewSubOrgs(element: any, allowNoSubOrg?: boolean) {
    if (element && ((element.subOrgs && element.subOrgs.length) || allowNoSubOrg)) {
      this.loadingService.show();
      try {
        const $getSubOrgs = await this.iamService.iam.getOrgHierarchy({
          namespace: element.namespace
        });

        if ($getSubOrgs.subOrgs && $getSubOrgs.subOrgs.length) {
          this.dataSource.data = JSON.parse(JSON.stringify($getSubOrgs.subOrgs));
          this.orgHierarchy.push(element);
        } else {
          this.toastr.warning('Sub-Organization List is empty.', 'Sub-Organization');
        }
      } catch (e) {
        console.error(e);
        this.toastr.error('An error has occured while retrieving the list.', 'Sub-Organization');
      } finally {
        this.loadingService.hide();
      }
    }
  }

  async resetOrgList(e: any, idx?: number) {
    e.preventDefault();

    if (idx === undefined) {
      if (this._isSubOrgCreated) {
        this._isSubOrgCreated = false;
        this.orgHierarchy.length = 0;
        await this.getList(this.defaultFilterOptions, true);
      } else {
        this.dataSource.data = JSON.parse(JSON.stringify(this.origDatasource));
        this.orgHierarchy.length = 0;
      }
    } else {
      const element = this.orgHierarchy[idx];
      this.orgHierarchy.length = idx;
      await this.viewSubOrgs(element);
    }
  }

  getTooltip(element: any) {
    let retVal = '';

    if (element.subOrgs && element.subOrgs.length) {
      let count = 0;
      if (element.subOrgs.length > 1) {
        retVal = 'Sub-Organizations \n';
      } else {
        retVal = 'Sub-Organization \n';
      }

      while (count < MAX_TOOLTIP_SUBORG_ITEMS && count < element.subOrgs.length) {
        retVal += `\n${element.subOrgs[count++].namespace}`;
      }

      if (element.subOrgs.length > MAX_TOOLTIP_SUBORG_ITEMS) {
        retVal += `\n\n ... +${element.subOrgs.length - MAX_TOOLTIP_SUBORG_ITEMS} More`;
      }
    }

    return retVal;
  }
}
