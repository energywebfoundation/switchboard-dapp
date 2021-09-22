import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-fields-summary',
  templateUrl: './fields-summary.component.html',
  styleUrls: ['./fields-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldsSummaryComponent {
  @Input() element;

  defaultValue = '--';

  get isText(): boolean {
    return this.element?.fieldType === 'text';
  }

  get isBoolean(): boolean {
    return this.element?.fieldType === 'boolean';
  }

  get isDate(): boolean {
    return this.element?.fieldType === 'date';
  }

  get isNumber(): boolean {
    return this.element?.fieldType === 'number';
  }
}
