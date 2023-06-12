import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { KeyValue } from '@angular/common';
import { IFieldDefinition } from '@energyweb/credential-governance/dist/src/types/domain-definitions';
import { JsonObject } from '@angular-devkit/core';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsComponent {
  @Input() title: string;
  @Input() showMergeButton = false;
  @Input() fieldsList: KeyValue<string, string | number>[];
  @Output() fieldToCopy = new EventEmitter<KeyValue<string, string | number>>();
  @Input() issuerFields: IFieldDefinition[] | undefined;
  hasValidValue(val: string | number) {
    return val && val !== 'null';
  }

  isJsonString(value: string | number) {
    if (typeof value === 'number') {
      return false;
    }
    try {
      JSON.parse(value);
    } catch {
      return false;
    }
    return true;
  }

  parseToJson(value: string | number): JsonObject {
    if (typeof value === 'number') {
      return;
    }
    return JSON.parse(value);
  }
}
