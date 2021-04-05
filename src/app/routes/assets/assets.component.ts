import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTabGroup } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetListType } from 'src/app/shared/constants/shared-constants';
import { UrlParamService } from 'src/app/shared/services/url-param.service';
import { AssetListComponent, RESET_LIST } from './asset-list/asset-list.component';
import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  @ViewChild("assetsTabGroup", { static: false }) assetsTabGroup: MatTabGroup;
  @ViewChild('listMyAssets', undefined ) listMyAssets: AssetListComponent;
  @ViewChild('listOfferedAssets', undefined ) listOfferedAssets: AssetListComponent;
  @ViewChild('listPreviousAssets', undefined ) listPreviousAssets: AssetListComponent;

  AssetListType = AssetListType;
  
  constructor(private dialog: MatDialog,
    private urlParamService: UrlParamService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
       if (params && params.selectedTab) {
         this.assetsTabGroup.selectedIndex = params.selectedTab;
       }
     }).unsubscribe();
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
    });

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
}