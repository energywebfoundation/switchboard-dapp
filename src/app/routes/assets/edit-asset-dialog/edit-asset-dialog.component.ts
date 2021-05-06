import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-asset-dialog',
  templateUrl: './edit-asset-dialog.component.html',
  styleUrls: ['./edit-asset-dialog.component.scss']
})
export class EditAssetDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditAssetDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
