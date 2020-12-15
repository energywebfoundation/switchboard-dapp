import { Component, OnInit, ViewChild } from '@angular/core';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { MatDialog, MatTabGroup } from '@angular/material';
import { NewApplicationComponent } from './new-application/new-application.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { GovernanceListComponent } from './governance-list/governance-list.component';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  @ViewChild("governanceTabGroup", { static: false }) governanceTabGroup: MatTabGroup;
  @ViewChild('listOrg', undefined ) listOrg: GovernanceListComponent;
  @ViewChild('listApp', undefined ) listApp: GovernanceListComponent;
  @ViewChild('listRole', undefined ) listRole: GovernanceListComponent;

  isAppShown = false;
  isRoleShown = false;
  isFilterShown: boolean = false;
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

  constructor(public dialog: MatDialog, private iamService: IamService) { }

  openNewOrgComponent(): void {
    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');

      if (result) {
        this.listOrg.getList();
      }
    });
  }

  openNewAppComponent(): void {
    const dialogRef = this.dialog.open(NewApplicationComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result) {
        this.listApp.getList();
      }
    });
  }

  openNewRoleComponent(): void {
    const dialogRef = this.dialog.open(NewRoleComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result) {
        this.listRole.getList();
      }
    });
  }

  async ngOnInit() {
    this.isIamEwcOwner = await this.iamService.iam.isOwner({
      domain: 'iam.ewc'
    });
  }

  async showMe(i: any) {
    if (i.index === 1) {
      // console.log('Showing App List');
      if (this.isAppShown) {
        await this.listApp.getList(this.defaultFilterOptions.app);
        this.defaultFilterOptions.app = undefined;
      }
      else {
        this.isAppShown = true;
      }
    }
    else if (i.index === 2) {
      // console.log('Showing Role List');
      if (this.isRoleShown) {
        await this.listRole.getList(this.defaultFilterOptions.role);
        this.defaultFilterOptions.role = undefined;
      }
      else {
        this.isRoleShown = true;
      }
    }
    else if (i.index === 0) {
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