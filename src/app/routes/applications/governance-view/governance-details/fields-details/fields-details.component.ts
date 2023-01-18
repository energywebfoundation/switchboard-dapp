import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFieldDefinition } from 'iam-client-lib';
import { FieldTypesEnum } from '../../../new-role/components/field-form/field-form.enum';

@Component({
  selector: 'app-fields-details',
  templateUrl: './fields-details.component.html',
  styleUrls: ['./fields-details.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsDetailsComponent {
  @Input() title: string;
  @Input() set data(data: IFieldDefinition[]) {
    this.fields = data.filter((item) => item.fieldType !== FieldTypesEnum.Json);
    this.jsonFields = data.filter(
      (item) => item.fieldType === FieldTypesEnum.Json
    );
  }
  get data() {
    return this.fields;
  }
  private fields: any[] = [];
  jsonFields: any[] = [];
  displayedColumnsView: string[] = [
    'type',
    'label',
    'required',
    'minLength',
    'maxLength',
    'pattern',
    'minValue',
    'maxValue',
    'minDate',
    'maxDate',
  ];
}
