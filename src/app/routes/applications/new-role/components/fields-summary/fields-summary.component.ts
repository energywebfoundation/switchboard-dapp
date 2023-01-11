import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FieldTypesEnum } from '../field-form/field-form.enum';

@Component({
  selector: 'app-fields-summary',
  templateUrl: './fields-summary.component.html',
  styleUrls: ['./fields-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsSummaryComponent {
  @Input() element;

  defaultValue = '--';

  get isText(): boolean {
    return this.element?.fieldType === FieldTypesEnum.Text;
  }

  get isBoolean(): boolean {
    return this.element?.fieldType === FieldTypesEnum.Boolean;
  }

  get isDate(): boolean {
    return this.element?.fieldType === FieldTypesEnum.Date;
  }

  get isNumber(): boolean {
    return this.element?.fieldType === FieldTypesEnum.Number;
  }

  get isJson(): boolean {
    return this.element?.fieldType === FieldTypesEnum.Json;
  }
}
