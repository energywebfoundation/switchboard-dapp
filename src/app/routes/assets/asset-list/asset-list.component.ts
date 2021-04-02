import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Asset } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { AssetListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TransferOwnershipComponent } from '../../applications/transfer-ownership/transfer-ownership.component';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

export const RESET_LIST = true;

const HEADER_TRANSFER_OWNERSHIP = 'Transfer Ownership';
const HEADER_CANCEL_OWNERSHIP = 'Cancel Offered Ownership';

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
        this.toastr.success('Asset is offered successfully.', HEADER_TRANSFER_OWNERSHIP);
        this.getAssetList(RESET_LIST);
      }
      dialogRef.unsubscribe();
    });
  }

  private async _confirm(confirmationMsg: string, header: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: header,
        message: confirmationMsg
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async cancelAssetOffer(data: Asset) {
    if (await this._confirm('The offered ownership of this asset will be cancelled. Do you wish to continue?', HEADER_TRANSFER_OWNERSHIP)) {
      try {
        this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);
        await this.iamService.iam.cancelAssetOffer({
          assetDID: data.id
        });
        await this.getAssetList(RESET_LIST);
      }
      catch (e) {
        console.error(e);
        this.toastr.error(e.message || 'A system error has occured. Please contact system administrator.', HEADER_TRANSFER_OWNERSHIP);
      }
      finally {
        this.loadingService.hide();
      }
    }
  }
}