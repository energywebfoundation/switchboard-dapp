import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DidBookService } from '../../services/did-book.service';
import { map, tap } from 'rxjs/operators';
import { DidBookRecord } from '../models/did-book-record';

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
