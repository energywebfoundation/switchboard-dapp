import { MatDialog } from '@angular/material/dialog';
import { EventEmitter, Optional } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

export abstract class ActionBaseAbstract {
  abstract edited: EventEmitter<void>;
  @Optional() abstract deleteConfirmed?: EventEmitter<void>;

  protected constructor(protected dialog: MatDialog) {
  }

  protected showEditComponent<T>(component: ComponentType<T>, data: unknown) {
    const dialogRef = this.dialog.open(component, {
      width: '600px',
      data,
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.edited.emit();
        }
      });
  }

  protected deleteDialog(data: unknown) {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data,
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().subscribe((res: any) => {
        if (res) {
          this.deleteConfirmed.emit();
        }
      });
  }
}
