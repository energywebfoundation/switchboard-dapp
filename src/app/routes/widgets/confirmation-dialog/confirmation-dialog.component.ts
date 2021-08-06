import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  isDiscardButton = false;
  isProceedButton = false;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isDiscardButton = data && data.isDiscardButton ? true : false;
    this.isProceedButton = data && data.isProceedButton ? true : false;
  }

  closeMe(accept: boolean) {
    this.dialogRef.close(accept);
  }
}
