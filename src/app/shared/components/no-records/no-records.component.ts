import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-no-records',
  templateUrl: './no-records.component.html',
  styleUrls: ['./no-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoRecordsComponent {}
