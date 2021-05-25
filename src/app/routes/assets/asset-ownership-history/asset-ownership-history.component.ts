import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { sortByEmittedDate } from '../utils/sort/sort-by-emitted-date';

const TOASTR_HEADER = 'Asset Ownership History';

@Component({
  selector: 'app-asset-ownership-history',
  templateUrl: './asset-ownership-history.component.html',
  styleUrls: ['./asset-ownership-history.component.scss']
})
export class AssetOwnershipHistoryComponent implements OnInit {

  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['date', 'owner', 'offeredTo', 'type'];

  constructor(public dialogRef: MatDialogRef<AssetOwnershipHistoryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private iamService: IamService,
              private toastr: ToastrService,
              private loadingService: LoadingService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.show();
      const list = await this.iamService.iam.getAssetHistory({
        id: this.data.id
      });
      this.dataSource.data = sortByEmittedDate(list.map((item: any) => {
        item.emittedDate = new Date(item.timestamp);
        return item;
      }));
    } catch (e) {
      console.error(e);
      this.toastr.error(e.message || 'A system error has occured. Please contact system administrator.', TOASTR_HEADER);
    } finally {
      this.loadingService.hide();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
