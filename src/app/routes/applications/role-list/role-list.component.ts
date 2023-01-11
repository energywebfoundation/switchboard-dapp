import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { EnvService } from '../../../shared/services/env/env.service';
import { CascadingFilterService } from '@modules';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  providers: [CascadingFilterService],
})
export class RoleListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() predefinedFilters: { organization: string; application: string };

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource([]);
  readonly displayedColumns = ['name', 'type', 'namespace', 'actions'];

  private subscription$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store,
    private envService: EnvService,
    private cascadingFilterService: CascadingFilterService
  ) {}

  ngOnInit(): void {
    this.setData();
    this.getList();
    this.store
      .select(RoleSelectors.getList)
      .subscribe((list) => this.cascadingFilterService.setItems(list));
  }

  isOrgType(type: string): boolean {
    return type === RoleType.ORG;
  }

  isAppType(type: string): boolean {
    return type === RoleType.APP;
  }

  isCustomType(type: string): boolean {
    return type === RoleType.CUSTOM;
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
    this.subscription$.next(null);
    this.subscription$.complete();
  }

  getList() {
    this.store.dispatch(RoleActions.getList());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  viewDetails(data: any) {
    this.dialog.open(GovernanceViewComponent, {
      width: '600px',
      data: {
        type: ListType.ROLE,
        definition: data,
      },
      maxWidth: '100%',
      disableClose: true,
    });
  }

  edit(): void {
    this.getList();
  }

  filter(filters): void {
    this.store.dispatch(
      RoleActions.updateFilters({
        filters,
        namespace: this.envService.rootNamespace,
      })
    );
  }

  private setData(): void {
    this.cascadingFilterService
      .getList$()
      .pipe(takeUntil(this.subscription$))
      .subscribe((list) => {
        this.dataSource.data = list;
      });
  }
}
