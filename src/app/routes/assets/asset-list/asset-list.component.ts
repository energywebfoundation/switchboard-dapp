import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Asset } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { AssetListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TransferOwnershipComponent } from '../../applications/transfer-ownership/transfer-ownership.component';

export const RESET_LIST = true;

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.scss']
})
export class AssetListComponent implements OnInit {
  @Input('list-type') listType: number;
  @ViewChild(MatSort, undefined) sort: MatSort;
  
  AssetListType = AssetListType;

  dataSource : MatTableDataSource<Asset> = new MatTableDataSource([]);
  displayedColumns: string[] = ['id'];

  constructor(private toastr: ToastrService,
    private dialog: MatDialog,
    private iamService: IamService,
    private loadingService: LoadingService) { 
      
    }

  async ngOnInit(): Promise<void> {
    // Set Table Columns
    if (this.listType === AssetListType.OFFERED_ASSETS) {
      this.displayedColumns.push('owner');
    }
    else {
      this.displayedColumns.push('offeredTo');
    }
    this.displayedColumns.push('actions');

    // Initialize List
    if (this.listType === AssetListType.MY_ASSETS) {
      await this.getAssetList(RESET_LIST);
    }
  }

  async getAssetList(resetList?: boolean) {
    if (!resetList) {
      return;
    }
    try {
      this.loadingService.show();
      if (this.listType === AssetListType.PREV_OWNED_ASSETS) {
        this.dataSource.data = await this.iamService.iam.getPreviouslyOwnedAssets({ owner: this.iamService.iam.getDid() });
      }
      else if (this.listType === AssetListType.OFFERED_ASSETS) {
        this.dataSource.data = await this.iamService.iam.getOfferedAssets();
      }
      else {
        this.dataSource.data = await this.iamService.iam.getOwnedAssets();
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error(e.message || 'Could not retrieve list. Please contact system administrator.');
    }
    finally {
      this.loadingService.hide();
    }
  }

  transferOwnership(type: any, data: Asset) {
    const dialogRef = this.dialog.open(TransferOwnershipComponent, {
      width: '600px', data:{
        assetDid: data.id,
        type: type,
        owner: data.owner
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe((res: any) => {
      if (res) {
        this.toastr.success('Asset is offered successfully.', 'Transfer Ownership');
        this.getAssetList(RESET_LIST);
      }
      dialogRef.unsubscribe();
    });
  }
}