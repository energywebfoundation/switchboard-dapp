import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetListType } from 'src/app/shared/constants/shared-constants';
import { UrlParamService } from 'src/app/shared/services/url-param.service';
import { AssetListComponent, RESET_LIST } from './asset-list/asset-list.component';
import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit, AfterViewInit {
  @ViewChild('assetsTabGroup') assetsTabGroup: MatTabGroup;
  @ViewChild('listMyAssets' ) listMyAssets: AssetListComponent;
  @ViewChild('listOfferedAssets') listOfferedAssets: AssetListComponent;
  @ViewChild('listPreviousAssets') listPreviousAssets: AssetListComponent;

  AssetListType = AssetListType;

  constructor(private dialog: MatDialog,
    private urlParamService: UrlParamService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(async (queryParams: any) => {
      if (queryParams) {
        if (queryParams.notif) {
          if (queryParams.notif === 'assetsOfferedToMe') {
            this.initDefault(1);
          }
          else {
            this.initDefault();
          }
        }
        else if (queryParams.selectedTab) {
          if (queryParams.selectedTab) {
            this.initDefault(queryParams.selectedTab);
          }
          else {
            this.initDefault();
          }
        }
        else {
          this.initDefault();
        }
      }
      else {
        this.initDefault();
      }
    });
   }

  registerAsset() {
    const dialogRef = this.dialog.open(NewPassiveAssetComponent, {
      width: '600px',data:{},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listMyAssets.getAssetList(RESET_LIST);
      }
    });
  }

  async showMe(i: any) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(this.router, this.activatedRoute, {
      selectedTab: i.index
    }, ['notif']);

    switch (i.index) {
      case 0:
        this.listMyAssets.getAssetList(RESET_LIST);
        break;
      case 1:
        this.listOfferedAssets.getAssetList(RESET_LIST);
        break;
      case 2:
        this.listPreviousAssets.getAssetList(RESET_LIST);
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