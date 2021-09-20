import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-minified-did-viewer-dialog',
  templateUrl: './minified-did-viewer-dialog.component.html',
  styleUrls: ['./minified-did-viewer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinifiedDidViewerDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
