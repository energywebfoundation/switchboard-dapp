import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { GovernanceViewComponent } from '../governance-view/governance-view.component';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { RoleType } from '../new-role/new-role.component';
import { Store } from '@ngrx/store';
import { RoleActions, RoleSelectors } from '@state';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() listType: string;
  @Input() isFilterShown: boolean;
  @Output() updateFilter = new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  ListType = ListType;
  RoleType = RoleType;
  dataSource = new MatTableDataSource([]);
  readonly displayedColumns = ['name', 'type', 'namespace', 'actions'];

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
              private toastr: SwitchboardToastrService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.setData();
    this.getList();
  }

  isOrgType(element): boolean {
    return element?.definition?.roleType === RoleType.ORG;
  }

  isAppType(element): boolean {
    return element?.definition?.roleType === RoleType.APP;
  }

  isCustomType(element): boolean {
    return element?.definition?.roleType === RoleType.CUSTOM;
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

  public getList() {
    this.store.dispatch(RoleActions.getList());
  }

  viewDetails(data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px', data: {
        type: ListType.ROLE,
        definition: data
      },
      maxWidth: '100%',
      disableClose: true
    });
  }

  edit() {
    this.getList();
  }

  filter() {
    // Trim Filters
    this.filterForm.get('organization').setValue(this.filterForm.value.organization.trim());
    this.filterForm.get('application').setValue(this.filterForm.value.application.trim());
    this.filterForm.get('role').setValue(this.filterForm.value.role.trim());

    this.store.dispatch(RoleActions.updateFilters({
      filters: {
        organization: this.filterForm.value.organization,
        application: this.filterForm.value.application,
        role: this.filterForm.value.role
      }
    }));
  }

  resetFilter() {
    this.store.dispatch(RoleActions.clearFilters());
  }

  private setData(): void {
    this.store.select(RoleSelectors.getFilteredList).pipe(
      takeUntil(this.subscription$)
    ).subscribe((list) => {
      this.dataSource.data = list;
    });
  }
}
