import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { StakingPoolServiceFacade } from '../../../shared/services/staking/staking-pool-service-facade';
import { ENSNamespaceTypes, IOrganization } from 'iam-client-lib';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { NewOrganizationComponent, ViewType } from '../new-organization/new-organization.component';
import { filter, takeUntil } from 'rxjs/operators';
import { ListType } from 'src/app/shared/constants/shared-constants';

const OrgColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];

const ALLOW_NO_SUBORG = true;
const MAX_TOOLTIP_SUBORG_ITEMS = 5;


@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit, OnDestroy {
  @Output() updateFilter = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  listType = ListType.ORG;

  dataSource = new MatTableDataSource([]);
  origDatasource = [];
  displayedColumns: string[];

  orgHierarchy = [];

  private _isSubOrgCreated = false;
  private subscription$ = new Subject();

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private dialog: MatDialog,
              private toastr: SwitchboardToastrService,
              private stakingService: StakingPoolServiceFacade) {
  }

  async ngOnInit() {
    this.displayedColumns = OrgColumns;

    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return item.definition.orgName.toLowerCase();
      } else if (property === 'type') {
        return item.definition.roleType;
      } else {
        return item[property];
      }
    };

    await this.getList();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public async getList(resetList?: boolean) {
    if (this.orgHierarchy.length && !resetList) {
      return;
    }
    this.loadingService.show();

    let orgList = await this.iamService.getENSTypesByOwner(ENSNamespaceTypes.Organization);

    let services = await this.stakingService.allServices().toPromise();
    const servicesNames = services.map((service) => service.org);
    const listWithProvidersInfo = (orgList as IOrganization[]).map((org: IOrganization) => ({
      ...org,
      isProvider: servicesNames.includes(org.namespace)
    }));
    // Retrieve only main orgs
    orgList = this._getMainOrgs(listWithProvidersInfo);
    this.origDatasource = orgList;
    console.log(this.origDatasource);

    this.dataSource.data = JSON.parse(JSON.stringify(this.origDatasource));
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

  viewDetails(data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px', data: {
        type: ListType.ORG,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  viewApps(data: any) {
    this.updateFilter.emit({
      listType: ListType.APP,
      organization: data.namespace.split('.iam.ewc')[0]
    });
  }

  viewRoles(data: any) {
    this.updateFilter.emit({
      listType: ListType.ROLE,
      organization: data.namespace.split('.iam.ewc')[0],
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
    const steps = await this.getRemovalSteps(roleDefinition);

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

  private async getRemovalSteps(roleDefinition: any) {
    this.loadingService.show();
    const returnSteps = this.iamService.iam.address === roleDefinition.owner;
    const call = this.iamService.iam.deleteOrganization({
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

  createSubOrg(parentOrg: any) {
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

    dialogRef.afterClosed()
      .pipe(
        filter(Boolean),
        takeUntil(this.subscription$))
      .subscribe(async () => await this.newSubOrg(parentOrg));
  }

  async newSubOrg(parentOrg: any) {
    this._isSubOrgCreated = true;
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
        await this.getList(true);
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
