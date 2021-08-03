import { MatDialog } from '@angular/material/dialog';
import { EventEmitter, Output } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

export abstract class ActionBaseAbstract {
  @Output() edited = new EventEmitter();

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
}
