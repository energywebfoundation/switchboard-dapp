/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetListType } from '../../shared/constants/shared-constants';
import { UrlParamService } from '../../shared/services/url-param.service';
import { AssetListComponent } from './asset-list/asset-list.component';
import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent implements AfterViewInit {
  @ViewChild('assetsTabGroup') assetsTabGroup: MatTabGroup;
  @ViewChild('listMyAssets') listMyAssets: AssetListComponent;
  @ViewChild('listOfferedAssets') listOfferedAssets: AssetListComponent;
  @ViewChild('listPreviousAssets') listPreviousAssets: AssetListComponent;

  AssetListType = AssetListType;

  constructor(
    private dialog: MatDialog,
    private urlParamService: UrlParamService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(async (queryParams: any) => {
      if (queryParams) {
        if (queryParams.notif) {
          if (queryParams.notif === 'assetsOfferedToMe') {
            this.initDefault(1);
          } else {
            this.initDefault();
          }
        } else if (queryParams.selectedTab) {
          if (queryParams.selectedTab) {
            this.initDefault(queryParams.selectedTab);
          } else {
            this.initDefault();
          }
        } else {
          this.initDefault();
        }
      } else {
        this.initDefault();
      }
    });
  }

  registerAsset() {
    const dialogRef = this.dialog.open(NewPassiveAssetComponent, {
      width: '600px',
      data: {},
      maxWidth: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listMyAssets.getAssetList();
      }
    });
  }

  async showMe(i: any) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(
      this.router,
      this.activatedRoute,
      {
        selectedTab: i.index,
      },
      ['notif']
    );

    switch (i.index) {
      case 0:
        this.listMyAssets.getAssetList();
        break;
      case 1:
        this.listOfferedAssets.getAssetList();
        break;
      case 2:
        this.listPreviousAssets.getAssetList();
        break;
      default:
    }
  }

  setSelectedTab(i: number) {
    this.assetsTabGroup.selectedIndex = i;
  }

  private initDefault(index?: number) {
    if (this.assetsTabGroup) {
      this.assetsTabGroup.selectedIndex = index || 0;
    }
  }
}
