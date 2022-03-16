import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectAssetDialogData } from './select-asset-dialog.interface';
import { OwnedAssetsActions, OwnedAssetsSelectors } from '@state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-select-asset-dialog',
  templateUrl: './select-asset-dialog.component.html',
  styleUrls: ['./select-asset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAssetDialogComponent implements OnInit {
  dataSource$ = this.store.select(
    OwnedAssetsSelectors.getAssetsWithSelection(this.data.assetDiD)
  );
  displayedColumns: string[] = ['logo', 'name', 'id', 'actions'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: SelectAssetDialogData,
    public dialogRef: MatDialogRef<SelectAssetDialogComponent>,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(OwnedAssetsActions.getOwnedAssets());
  }
}
