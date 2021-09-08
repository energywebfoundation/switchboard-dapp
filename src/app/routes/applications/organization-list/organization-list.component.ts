import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { StakingPoolServiceFacade } from '../../../shared/services/staking/staking-pool-service-facade';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { Store } from '@ngrx/store';
import { OrganizationActions, OrganizationSelectors } from '@state';

const OrgColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];

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
  displayedColumns: string[];

  organizationHierarchy$ = this.store.select(OrganizationSelectors.getHierarchy).pipe(tap((hierarchy) => this.orgHierarchy = [...hierarchy]));
  orgHierarchy = [];

  private subscription$ = new Subject();

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private dialog: MatDialog,
              private toastr: SwitchboardToastrService,
              private stakingService: StakingPoolServiceFacade,
              private store: Store) {
  }

  async ngOnInit() {
    this.setupDatatable();
    this.setList();
    this.getList();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public getList(resetList?: boolean) {
    if (this.orgHierarchy.length && !resetList) {
      return;
    }
    this.store.dispatch(OrganizationActions.getList());
  }

  private setList(): void {
    this.store.select(OrganizationSelectors.getList).pipe(
      filter((list) => list.length > 0),
      takeUntil(this.subscription$)
    ).subscribe((list) => {
      this.dataSource.data = list;
    });
  }

  private setupDatatable(): void {
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

  async newSubOrg(parentOrg: any) {
    this.store.dispatch(OrganizationActions.createSub({org: parentOrg}));
  }

  async viewSubOrgs(element: any, allowNoSubOrg?: boolean) {
    if (element && ((element.subOrgs && element.subOrgs.length) || allowNoSubOrg)) {
      this.store.dispatch(OrganizationActions.setHistory({element}));
    }
  }

  cleanUpHierarchy(e: Event) {
    e.preventDefault();
    this.store.dispatch(OrganizationActions.cleanHierarchy());
  }

  goToInHierarchy(e: any, element) {
    e.preventDefault();
    this.store.dispatch(OrganizationActions.setHistory({element}));
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
