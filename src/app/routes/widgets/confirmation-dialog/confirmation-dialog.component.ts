import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  isDiscardButton = false;
  isProceedButton = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.isDiscardButton = data && data.isDiscardButton ? true : false;
      this.isProceedButton = data && data.isProceedButton ? true : false;
    }

  ngOnInit() {}

  closeMe (accept: boolean) {
    this.dialogRef.close(accept);
  }
}
