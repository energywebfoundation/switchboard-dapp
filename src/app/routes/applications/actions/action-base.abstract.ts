import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { filter } from 'rxjs/operators';

export abstract class ActionBaseAbstract {
  abstract edited: EventEmitter<void>;
  abstract deleteConfirmed?: EventEmitter<void>;

  protected constructor(protected dialog: MatDialog) {}

  protected showEditComponent<T>(component: ComponentType<T>, data: unknown) {
    const dialogRef = this.dialog.open(component, {
      width: '600px',
      data,
      maxWidth: '100%',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.edited.emit();
      });
  }

  protected deleteDialog(data: unknown) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data,
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((res: any) => {
        if (res) {
          this.deleteConfirmed.emit();
        }
      });
  }
}
