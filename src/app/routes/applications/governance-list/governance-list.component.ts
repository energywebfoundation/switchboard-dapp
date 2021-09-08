import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ENSNamespaceTypes } from 'iam-client-lib';
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

const AppColumns: string[] = ['logoUrl', 'name', 'namespace', 'actions'];
const RoleColumns: string[] = ['name', 'type', 'namespace', 'actions'];

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

  private subscription$ = new Subject();

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private toastr: SwitchboardToastrService) {
  }

  async ngOnInit() {
    switch (this.listType) {
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

  public async getList(filterOptions?: any) {
    this.loadingService.show();

    this.origDatasource = await this.iamService.getENSTypesByOwner(this.ensType);

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

  viewRoles(type: string, data: any) {
    let org;
    let app;

    let arr = data.namespace.split('.iam.ewc');
    arr = arr[0].split(ENSNamespaceTypes.Roles);
    arr = arr[arr.length - 1].split(ENSNamespaceTypes.Application);
    org = arr[arr.length - 1];

    if (org.indexOf('.') === 0) {
      org = (org as string).substr(1);
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
    await this.getList();
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
        await this.getList();
      }

    }
  }

  async newRole(listType: string, roleDefinition: any) {
    this.viewRoles(listType, roleDefinition);
  }

  private async getRemovalSteps(listType: string, roleDefinition: any) {
    this.loadingService.show();
    const returnSteps = this.iamService.iam.address === roleDefinition.owner;
    const call = this.iamService.iam.deleteApplication({
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
}
