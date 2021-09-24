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
import { filterBy } from '../filter-by/filter-by';

const RoleColumns: string[] = ['name', 'type', 'namespace', 'actions'];

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy, AfterViewInit {
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
    this.displayedColumns = RoleColumns;

    await this.getList(this.defaultFilterOptions);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return item.definition.roleName.toLowerCase();
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

    this.origDatasource = await this.iamService.getENSTypesByOwner(ENSNamespaceTypes.Roles);

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
    // Trim Filters
    this.filterForm.get('organization').setValue(this.filterForm.value.organization.trim());
    this.filterForm.get('application').setValue(this.filterForm.value.application.trim());
    this.filterForm.get('role').setValue(this.filterForm.value.role.trim());

    this.dataSource.data = filterBy(JSON.parse(JSON.stringify(this.origDatasource)),
      this.filterForm.value.organization,
      this.filterForm.value.application,
      this.filterForm.value.role);
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
