import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { ListType } from '../../shared/constants/shared-constants';
import { IamService } from '../../shared/services/iam.service';
import { UrlParamService } from '../../shared/services/url-param.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { OrganizationActions, OrganizationSelectors } from '@state';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { RoleListComponent } from './role-list/role-list.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('governanceTabGroup') governanceTabGroup: MatTabGroup;
  @ViewChild('listOrg') listOrg: OrganizationListComponent;
  @ViewChild('listApp') listApp: ApplicationListComponent;
  @ViewChild('listRole') listRole: RoleListComponent;

  hierarchyLength$ = this.store.select(OrganizationSelectors.getHierarchyLength);
  isSelectedOrgNotOwnedByUser$ = this.store.select(OrganizationSelectors.isSelectedOrgNotOwnedByUser);

  isAppShown = false;
  isRoleShown = false;
  isFilterShown = false;
  isIamEwcOwner = false;

  showFilter = {
    org: false,
    app: false,
    role: false
  };
  defaultFilterOptions = {
    app: undefined,
    role: undefined
  };

  ListType = ListType;

  private subscription$ = new Subject();

  constructor(public dialog: MatDialog,
              private iamService: IamService,
              private urlParamService: UrlParamService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store) {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params && params.selectedTab) {
        this.governanceTabGroup.selectedIndex = params.selectedTab;
      }
    }).unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  openNewOrgComponent(): void {
    if (!this.isIamEwcOwner) {
      const namespace = 'orgcreator.apps.testorg.iam.ewc';
      const roleName = 'orgowner';
      this.router.navigate([`enrol`], {queryParams: {roleName, app: namespace, stayLoggedIn: true}});
      return;
    }

    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',
      data: {},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.subscription$))
      .subscribe(result => {
        // console.log('The dialog was closed');

        if (result) {
          this.listOrg.getList(true);
        }
      });
  }

  createSubOrg() {
    this.store.dispatch(OrganizationActions.createSubForParent());
  }

  async ngOnInit() {
    this.isIamEwcOwner = await this.iamService.iam.isOwner({
      domain: 'iam.ewc'
    });
  }

  async showMe(i: any) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(this.router, this.activatedRoute, {
      selectedTab: i.index
    });

    if (i.index === 1) {
      // console.log('Showing App List');
      if (this.isAppShown) {
        this.listApp.getList();
        this.defaultFilterOptions.app = undefined;
      } else {
        this.isAppShown = true;
      }
    } else if (i.index === 2) {
      // console.log('Showing Role List');
      if (this.isRoleShown) {
        await this.listRole.getList(this.defaultFilterOptions.role);
        this.defaultFilterOptions.role = undefined;
      } else {
        this.isRoleShown = true;
      }
    } else if (i.index === 0) {
      // console.log('Showing Org List');
      this.listOrg.getList();
    }
  }

  toggleFilter(listType: string) {
    switch (listType) {
      case ListType.ORG:
        this.showFilter.org = !this.showFilter.org;
        break;
      case ListType.APP:
        this.showFilter.app = !this.showFilter.app;
        break;
      case ListType.ROLE:
        this.showFilter.role = !this.showFilter.role;
        break;
    }
  }

  updateFilter(filterOptions: any) {
    // console.log('updateFilter', filterOptions);
    let tabIdx = 0;
    switch (filterOptions.listType) {
      case ListType.APP:
        this.showFilter.app = true;
        tabIdx = 1;
        this.defaultFilterOptions.app = filterOptions;
        break;
      case ListType.ROLE:
        this.showFilter.role = true;
        tabIdx = 2;
        this.defaultFilterOptions.role = filterOptions;
        break;
    }

    this.governanceTabGroup.selectedIndex = tabIdx;
  }
}
