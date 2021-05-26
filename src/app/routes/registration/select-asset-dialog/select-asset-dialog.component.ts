import {Component, Inject, OnInit} from '@angular/core';
import { Asset } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {IDialogData} from './select-asset-dialog.interface';

@Component({
  selector: 'app-select-asset-dialog',
  templateUrl: './select-asset-dialog.component.html',
  styleUrls: ['./select-asset-dialog.component.scss']
})
export class SelectAssetDialogComponent implements OnInit {

  dataSource: MatTableDataSource<Asset> = new MatTableDataSource([]);
  displayedColumns: string[] = ['logo', 'name', 'id', 'actions'];

  constructor(
      @Inject(MAT_DIALOG_DATA) private data: IDialogData,
      public dialogRef: MatDialogRef<SelectAssetDialogComponent>,
      private loadingService: LoadingService,
      private iamService: IamService,
      private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.show();
      this.dataSource.data = (await this.iamService.iam.getOwnedAssets()).map((data: Asset) => {
        data['minifiedId'] = `${data.id.substr(0, 15)}...${data.id.substr(data.id.length - 5)}`;
        if (this.data.assetDiD) {
          this.data.assetDiD === data.id ? data['isSelected'] = true : data['isSelected'] = false;
          return data;
        }
        data['isSelected'] = false;
        return data;
      });
    }
    catch (e) {
      console.error(e);
      this.toastr.show('Asset list could not be retrieved at this time.', 'System Error');
    }
    finally {
      this.loadingService.hide();
    }
  }

  selectAsset(asset: Asset) {
    this.dialogRef.close(asset);
  }

  closeDialog(asset?: Asset) {
    this.dialogRef.close();
  }
}
