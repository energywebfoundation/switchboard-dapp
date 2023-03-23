import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

export interface ConfirmationDialogData {
  message?: string;
  header?: string;
  isDiscardButton?: boolean;
  isProceedButton?: boolean;
  svgIcon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent implements OnInit {
  isDiscardButton = false;
  isProceedButton = false;
  svgIcon;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  ngOnInit() {
    this.svgIcon = this.data?.svgIcon;
    this.isDiscardButton = this.data?.isDiscardButton;
    this.isProceedButton = this.data?.isProceedButton;
  }

  close(accept: boolean) {
    this.dialogRef.close(accept);
  }
}
