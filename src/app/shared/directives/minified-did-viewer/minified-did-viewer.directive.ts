import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MinifiedDidViewerDialogComponent } from './minified-did-viewer-dialog.component';

@Directive({
  selector: '[appMinifiedDidViewer]'
})
export class MinifiedDidViewerDirective {
  @Input() appMinifiedDidViewer: string;

  constructor(private dialog: MatDialog) { }

  @HostListener("click", ["$event"])
  onClick(event: MouseEvent) {
    if (this.appMinifiedDidViewer) {
      const viewDidDialog$ = this.dialog.open(MinifiedDidViewerDialogComponent, {
        width: '420px',
        maxHeight: '195px',
        data: {
          did: this.appMinifiedDidViewer
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().subscribe(() => {
        viewDidDialog$.unsubscribe();
      });
    }
  }
}
