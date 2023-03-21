/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from '@angular/core';

import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { sortByEmittedDate } from '../utils/sort/sort-by-emitted-date';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

const TOASTR_HEADER = 'Asset Ownership History';

@Component({
  selector: 'app-asset-ownership-history',
  templateUrl: './asset-ownership-history.component.html',
  styleUrls: ['./asset-ownership-history.component.scss'],
})
export class AssetOwnershipHistoryComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['date', 'owner', 'offeredTo', 'type'];

  constructor(
    public dialogRef: MatDialogRef<AssetOwnershipHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.show();
      const list = await this.iamService.assetsService.getAssetHistory({
        id: this.data.id,
      });
      this.dataSource.data = sortByEmittedDate(
        list.map((item: any) => {
          item.emittedDate = new Date(item.timestamp);
          return item;
        })
      );
    } catch (e) {
      console.error(e);
      this.toastr.error(
        e.message ||
          'A system error has occured. Please contact system administrator.',
        TOASTR_HEADER
      );
    } finally {
      this.loadingService.hide();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
