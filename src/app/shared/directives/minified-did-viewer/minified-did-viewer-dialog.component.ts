import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-minified-did-viewer-dialog',
  templateUrl: './minified-did-viewer-dialog.component.html',
  styleUrls: ['./minified-did-viewer-dialog.component.scss']
})
export class MinifiedDidViewerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MinifiedDidViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
