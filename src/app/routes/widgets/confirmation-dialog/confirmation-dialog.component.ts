import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  message: string;
  header?: string;
  isDiscardButton?: boolean;
  isProceedButton?: boolean;
  svgIcon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  isDiscardButton = false;
  isProceedButton = false;
  svgIcon;

  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
    this.svgIcon = data?.svgIcon;
    this.isDiscardButton = data?.isDiscardButton;
    this.isProceedButton = data?.isProceedButton;
  }

  closeMe(accept: boolean) {
    this.dialogRef.close(accept);
  }
}
