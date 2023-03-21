import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { DidBookService } from '../../services/did-book.service';

@Component({
  selector: 'app-add-single-record',
  templateUrl: './add-single-record.component.html',
  styleUrls: ['./add-single-record.component.scss'],
})
export class AddSingleRecordComponent {
  constructor(
    private dialogRef: MatDialogRef<AddSingleRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { did: string },
    private didBookService: DidBookService
  ) {}

  addHandler(record) {
    this.didBookService.add(record);
    this.dialogRef.close();
  }

  cancelHandler() {
    this.dialogRef.close();
  }

  get didList$() {
    return this.didBookService.getDIDList$();
  }
}
