import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
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
  @ViewChild(MatSort) sort: MatSort;

  RoleType = RoleType;
  dataSource = new MatTableDataSource([]);
  readonly displayedColumns = ['name', 'type', 'namespace', 'actions'];

  filters$ = this.store.select(RoleSelectors.getFilters);
  isFilterVisible$ = this.store.select(RoleSelectors.isFilterVisible);

  private subscription$ = new Subject();

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
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

  getList() {
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

  edit(): void {
    this.getList();
  }

  filter(filters): void {
    this.store.dispatch(RoleActions.updateFilters({filters}));
  }

  private setData(): void {
    this.store.select(RoleSelectors.getFilteredList).pipe(
      takeUntil(this.subscription$)
    ).subscribe((list) => {
      this.dataSource.data = list;
    });
  }
}
