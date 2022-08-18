import { Injectable } from '@angular/core';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../routes/widgets/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { truthy } from '@operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: data,
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed();
  }
}
