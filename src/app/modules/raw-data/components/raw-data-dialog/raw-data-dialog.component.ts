import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-raw-data-dialog',
  templateUrl: './raw-data-dialog.component.html',
  styleUrls: ['./raw-data-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawDataDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { dataToDisplay: unknown; header: string }
  ) {}

  get header() {
    return this.data?.header;
  }

  get dataToDisplay() {
    return this.data.dataToDisplay;
  }
}
