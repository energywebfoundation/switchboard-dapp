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
import { Store } from '@ngrx/store';
import { ApplicationActions, ApplicationSelectors } from '@state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isFilterShown: boolean;
  @Output() updateFilter = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource([]);
  readonly displayedColumns = ['logoUrl', 'name', 'namespace', 'actions'];

  filters$ = this.store.select(ApplicationSelectors.getFilters);

  private subscription$ = new Subject();

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private toastr: SwitchboardToastrService,
              private store: Store) {
  }

  ngOnInit() {
    this.getList();
    this.setData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return item.definition.appName.toLowerCase();
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

  private setData() {
    this.store.select(ApplicationSelectors.getFilteredList).pipe(
      takeUntil(this.subscription$)
    ).subscribe((list) => {
      this.dataSource.data = list;
    });
  }

  public getList() {
    this.store.dispatch(ApplicationActions.getList());
  }

  viewDetails(data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px', data: {
        type: ListType.APP,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  viewRoles(data: { namespace: string }) {
    const [app, org] = data.namespace
      .replace('.iam.ewc', '')
      .split(`.${ENSNamespaceTypes.Application}.`);

    this.updateFilter.emit({
      listType: ListType.ROLE,
      organization: org,
      application: app
    });
  }

  async edit() {
    this.getList();
  }

  async remove(roleDefinition: any) {
    const listType = ListType.APP;
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
      this.toastr.error(e, 'Delete ' + (listType === ListType.ORG ? 'Organization' : 'Application'));
    } finally {
      this.loadingService.hide();
    }
  }

  filter(filters): void {
    this.store.dispatch(ApplicationActions.updateFilters({filters}));
  }

  resetFilter() {
    this.store.dispatch(ApplicationActions.clearFilters());
  }
}
