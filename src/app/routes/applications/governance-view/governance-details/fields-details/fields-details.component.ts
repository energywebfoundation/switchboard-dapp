import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFieldDefinition } from 'iam-client-lib';
import { FieldTypesEnum } from '../../../new-role/components/field-form/field-form.enum';
import { JsonEditorOptions } from '@modules';

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

  get containsFields() {
    return this.data.length > 0 || this.jsonFields.length > 0;
  }

  generateOptions(schema: Record<string, unknown>, name?: string) {
    const editorOptions = new JsonEditorOptions();
    editorOptions.modes = ['tree', 'view'];
    editorOptions.mode = 'view';
    editorOptions.schema = schema;
    editorOptions.name = name;
    return editorOptions;
  }
  private fields: IFieldDefinition[] = [];
  jsonFields: IFieldDefinition[] = [];
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
