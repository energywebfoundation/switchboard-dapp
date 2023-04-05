import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  @Input() title: string;
  @Input() isIssuerRequestView = false;
  @Input() fieldsList: KeyValue<string, string | number>[];
  @Output() fieldToCopy = new EventEmitter<KeyValue<string, string | number>>();
  @Input() issuerFields: IFieldDefinition[] | undefined;
  hasValidValue(val: string | number) {
    return val && val !== 'null';
  }

  showMergeButton(field): boolean {
    return (
      this.isIssuerRequestView &&
      this.hasValidValue(field?.value) &&
      !!this.issuerFields.find((fld) => fld.label === field.label)
    );
  }
}
