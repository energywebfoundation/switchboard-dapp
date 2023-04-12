import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-minified-did-viewer-dialog',
  templateUrl: './minified-did-viewer-dialog.component.html',
  styleUrls: ['./minified-did-viewer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinifiedDidViewerDialogComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
