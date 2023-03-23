/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FormBuilder } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { RemoveOrgAppComponent } from '../remove-org-app/remove-org-app.component';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { Store } from '@ngrx/store';
import { ApplicationActions, ApplicationSelectors } from '@state';
import { CascadingFilterService } from '@modules';
import { takeUntil } from 'rxjs/operators';
import { DomainUtils } from '@utils';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss'],
  providers: [CascadingFilterService],
})
export class ApplicationListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() predefinedFilters: { organization: string };
  @Output() updateFilter = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource([]);
  readonly displayedColumns = ['logoUrl', 'name', 'namespace', 'actions'];

  private subscription$ = new Subject();

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: SwitchboardToastrService,
    private store: Store,
    private cascadingFilterService: CascadingFilterService
  ) {}

  ngOnInit() {
    this.getList();
    this.setData();
    this.store
      .select(ApplicationSelectors.getList)
      .subscribe((list) => this.cascadingFilterService.setItems(list));
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
    this.subscription$.next(null);
    this.subscription$.complete();
  }

  private setData() {
    this.cascadingFilterService
      .getList$()
      .pipe(takeUntil(this.subscription$))
      .subscribe((list) => (this.dataSource.data = list));
  }

  public getList() {
    this.store.dispatch(ApplicationActions.getList());
  }

  viewDetails(data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px',
      data: {
        type: ListType.APP,
        definition: data,
      },
      maxWidth: '100%',
      disableClose: true,
    });
  }

  viewRoles(data: { namespace: string }) {
    this.updateFilter.emit({
      listType: ListType.ROLE,
      organization: DomainUtils.getOrgName(data.namespace),
      application: DomainUtils.getAppName(data.namespace),
    });
  }

  edit() {
    this.getList();
  }

  transferOwnership() {
    this.getList();
  }

  async remove(roleDefinition: any) {
    const listType = ListType.APP;
    // Get Removal Steps
    const steps = await this.getRemovalSteps(listType, roleDefinition);

    if (steps) {
      // Launch Remove Org / App Dialog
      const isRemoved = this.dialog
        .open(RemoveOrgAppComponent, {
          width: '600px',
          data: {
            namespace: roleDefinition.namespace,
            listType,
            steps,
          },
          maxWidth: '100%',
          disableClose: true,
        })
        .afterClosed()
        .toPromise();

      // Refresh the list after successful removal
      if (await isRemoved) {
        await this.getList();
      }
    }
  }

  private async getRemovalSteps(listType: string, roleDefinition: any) {
    this.loadingService.show();
    const returnSteps =
      this.iamService.signerService.address === roleDefinition.owner;
    const call = this.iamService.domainsService.deleteApplication({
      namespace: roleDefinition.namespace,
      returnSteps,
    });
    try {
      return returnSteps
        ? await call
        : [
            {
              info: 'Confirm removal in your safe wallet',
              next: async () => await call,
            },
          ];
    } catch (e) {
      console.error(e);
      this.toastr.error(
        e,
        'Delete ' + (listType === ListType.ORG ? 'Organization' : 'Application')
      );
    } finally {
      this.loadingService.hide();
    }
  }
}
