import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { ListType } from '../../shared/constants/shared-constants';
import { IamService } from '../../shared/services/iam.service';
import { UrlParamService } from '../../shared/services/url-param.service';
import { takeUntil } from 'rxjs/operators';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  MatLegacyTabChangeEvent as MatTabChangeEvent,
  MatLegacyTabGroup as MatTabGroup,
} from '@angular/material/legacy-tabs';
import { Store } from '@ngrx/store';
import {
  OrganizationActions,
  OrganizationSelectors,
  RoleActions,
} from '@state';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { EnvService } from '../../shared/services/env/env.service';
import { RouterConst } from '../router-const';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('governanceTabGroup') governanceTabGroup: MatTabGroup;
  @ViewChild('listOrg') listOrg: OrganizationListComponent;
  @ViewChild('listApp') listApp: ApplicationListComponent;
  @ViewChild('listRole') listRole: RoleListComponent;

  hierarchyLength$ = this.store.select(
    OrganizationSelectors.getHierarchyLength
  );
  isSelectedOrgNotOwnedByUser$ = this.store.select(
    OrganizationSelectors.isSelectedOrgNotOwnedByUser
  );

  isAppShown = false;
  isRoleShown = false;
  isIamEwcOwner = false;

  applicationFilters = {
    organization: '',
  };

  roleFilters = {
    organization: '',
    application: '',
  };

  ListType = ListType;
  orgRequestButtonText: string;

  private subscription$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private iamService: IamService,
    private urlParamService: UrlParamService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private envService: EnvService
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((params: any) => {
        if (params && params.selectedTab) {
          this.governanceTabGroup.selectedIndex = params.selectedTab;
        }
      })
      .unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription$.next(null);
    this.subscription$.complete();
    this.cleanFilters();
  }

  handleNewOrgRequest(): void {
    if (this.envService.production) {
      this.createOrgRequestMailTo();
    } else {
      this.launchOrgCreatorForm();
    }
  }

  launchOrgCreatorForm() {
    if (!this.isIamEwcOwner) {
      const namespace =
        'orgcreator.apps.testorg.' + this.envService.rootNamespace;
      const roleName = 'org';
      this.router.navigate([RouterConst.Enrol], {
        queryParams: { roleName, app: namespace, stayLoggedIn: true },
      });
      return;
    }

    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',
      data: {},
      maxWidth: '100%',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.subscription$))
      .subscribe((result) => {
        if (result) {
          this.listOrg.getList(true);
        }
      });
  }

  createOrgRequestMailTo() {
    window.location.href = `mailto:${this.envService.orgRequestEmail}?subject=Create%20Organization&body=Sending%20request%20for%20the%20following%20organization%20in%20Switchboard%3A%20%7Bplease%20fill%20in%20org%20name%7D`;
  }

  createSubOrg() {
    this.store.dispatch(OrganizationActions.createSubForParent());
  }

  async ngOnInit() {
    this.isIamEwcOwner = await this.iamService.domainsService.isOwner({
      domain: this.envService.rootNamespace,
    });
    this.orgRequestButtonText = this.envService.production
      ? 'Request to Create Organization'
      : 'Create Organization';
  }

  showMe(i: MatTabChangeEvent) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(this.router, this.activatedRoute, {
      selectedTab: i.index,
    });

    if (i.index === 1) {
      // console.log('Showing App List');
      if (this.isAppShown) {
        this.listApp.getList();
      } else {
        this.isAppShown = true;
      }
    } else if (i.index === 2) {
      // console.log('Showing Role List');
      if (this.isRoleShown) {
        this.listRole.getList();
      } else {
        this.isRoleShown = true;
      }
    } else if (i.index === 0) {
      // console.log('Showing Org List');
      this.listOrg.getList();
    }
  }

  updateRoleFilter(filters: {
    listType: any;
    organization: string;
    application?: string;
  }) {
    console.log(filters);
    this.roleFilters = {
      organization: filters.organization,
      application: filters?.application || '',
    };
    this.setTab(filters.listType);
  }

  updateAppFilter(filters: {
    listType: any;
    organization: string;
    application?: string;
  }) {
    this.applicationFilters = { organization: filters.organization };
    this.setTab(filters.listType);
  }

  setTab(listType): void {
    let tabIdx = 0;
    switch (listType) {
      case ListType.APP:
        tabIdx = 1;
        break;
      case ListType.ROLE:
        tabIdx = 2;
        break;
    }

    this.governanceTabGroup.selectedIndex = tabIdx;
  }

  private cleanFilters(): void {
    this.store.dispatch(RoleActions.cleanUpFilters());
  }
}
