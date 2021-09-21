import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { RoleType } from '../new-role/new-role.component';

const AppColumns: string[] =;

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    this.displayedColumns = ['logoUrl', 'name', 'namespace', 'actions'];
    this.ensType = ENSNamespaceTypes.Application;

    await this.getList(this.defaultFilterOptions);
  }

  ngAfterViewInit() {
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
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  public async getList(filterOptions?: any) {
    this.loadingService.show();

    this.origDatasource = await this.iamService.getENSTypesByOwner(ENSNamespaceTypes.Application);

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
