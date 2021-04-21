import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource } from '@angular/material';
import { Asset } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-select-asset-dialog',
  templateUrl: './select-asset-dialog.component.html',
  styleUrls: ['./select-asset-dialog.component.scss']
})
export class SelectAssetDialogComponent implements OnInit {
  
  dataSource : MatTableDataSource<Asset> = new MatTableDataSource([]);
  displayedColumns: string[] = ['logo','name','id', 'actions'];

  constructor(public dialogRef: MatDialogRef<SelectAssetDialogComponent>,
    private loadingService: LoadingService,
    private iamService: IamService,
    private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.show();
      this.dataSource.data = (await this.iamService.iam.getOwnedAssets()).map((data: Asset) => {
        data['minifiedId'] = `${data.id.substr(0, 15)}...${data.id.substr(data.id.length - 5)}`;
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
