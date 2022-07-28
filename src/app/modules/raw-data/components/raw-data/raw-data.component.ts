import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonObject } from '@angular-devkit/core';

@Component({
  selector: 'app-raw-data',
  templateUrl: './raw-data.component.html',
  styleUrls: ['./raw-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawDataComponent {
  @Input() data: JsonObject;
  @Input() message: string;

  get stringifyData() {
    return JSON.stringify(this.data);
  }
}
