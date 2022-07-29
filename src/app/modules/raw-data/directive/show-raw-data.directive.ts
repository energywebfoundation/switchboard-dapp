import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RawDataDialogComponent } from '../components/raw-data-dialog/raw-data-dialog.component';
import { JsonObject } from '@angular-devkit/core';

@Directive({
  selector: '[appShowRawData]',
})
export class ShowRawDataDirective {
  @Input() data: JsonObject;
  @Input() header: string;
  @HostListener('click', ['$event']) onClick() {
    this.dialog.open(RawDataDialogComponent, {
      width: '520px',
      data: {
        dataToDisplay: this.data,
        header: this.header,
      },
      maxWidth: '100%',
      disableClose: true,
    });
  }
  constructor(private dialog: MatDialog) {}
}
